import * as errors from '../runtime/error';
import * as op from '../op';

import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { empty, head, tail } from '@quenk/noni/lib/data/array';
import { just, Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import {
    isFunction,
    isNumber,
    isObject,
    isString,
    Type
} from '@quenk/noni/lib/data/type';

import { Context } from '../runtime/context';
import { handlers } from '../op';
import { FunInfo, ForeignFunInfo } from '../script/info';
import { Frame, StackFrame, Data, FrameName } from '../frame';
import { Script } from '../script';
import { TYPE_FUN } from '../type';
import { Platform } from '../';
import { Template } from '../../../template';
import { Address } from '../../../address';
import { Message } from '../../../message';
import { Thread, ThreadState } from './';
import { Job, JobType, JSJob, VMJob } from '../scheduler';
import { AsyncTask } from '../runtime';
import {
    CaseFunction,
    Default,
    TypeCase
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';

/**
 * SharedThread is used by actors that run in the same event loop as the VM.
 *
 * Code execution takes place when the resume() method is invoked by the VM's
 * Scheduler.
 */
export class SharedThread implements Thread {
    constructor(
        public vm: Platform,
        public script: Script,
        public context: Context,
        public frameStack: Frame[] = [],
        public frameStackPointer: number = 0,
        public returnPointer: Data = 0,
        public state: ThreadState = ThreadState.IDLE
    ) {}

    readonly self = this.context.address;

    /**
     * invokeVM invokes a VM function.
     *
     * The frame specified is the parent frame and arguments will be sourced
     * from its data stack.
     */
    invokeVM(p: Frame, f: FunInfo) {
        let frm = new StackFrame(
            makeFrameName(this, f.name),
            p.script,
            this,
            just(p),
            f.code.slice()
        );

        for (let i = 0; i < f.argc; i++) frm.push(p.pop());

        this.frameStack.push(frm);

        this.frameStackPointer = this.frameStack.length - 1;

        this.vm.scheduler.run();
    }

    /**
     * invokeForeign invokes a foreign function.
     *
     * The frame specified is the parent frame that will receive it's result.
     */
    invokeForeign(frame: Frame, fun: ForeignFunInfo, args: Type[]) {
        //TODO: Support async functions.
        let val = fun.exec.apply(null, [this, ...args]);

        if (isNumber(val)) frame.push(val);
        else if (isString(val)) frame.push(this.vm.registry.addString(val));
        else if (isObject(val)) frame.push(this.vm.registry.addObject(val));

        this.vm.scheduler.run();
    }

    notify(msg: Message) {
        this.context.mailbox.push(msg);

        if (this.state === ThreadState.MSG_WAIT) this.state = ThreadState.IDLE;

        this.vm.scheduler.run();
    }

    watch<T>(task: AsyncTask<T>) {
        let onError = (e: Error) => {
            this.raise(e);
        };
        let onSuccess = () => {
            this.state = ThreadState.IDLE;
            // Keep the Scheduler going.
            this.vm.scheduler.run();
        };
        Future.do(async () => {
            await (isFunction(task) ? task() : task);
        }).fork(onError, onSuccess);
    }

    wait<T>(task: AsyncTask<T>) {
        this.state = ThreadState.ASYNC_WAIT;
        this.watch(task);
    }

    exit() {
        this.state = ThreadState.INVALID;
        this.vm.kill(this, this.context.address).fork();
    }

    kill(address: Address): Future<void> {
        return this.vm.kill(this, address);
    }

    raise(e: Err) {
        this.state = ThreadState.ERROR;
        this.vm.raise(this, e).fork();
    }

    spawn(tmpl: Template): Future<Address> {
        return Future.fromCallback(cb => {
            this.vm.scheduler.postJob(
                new JSJob(
                    this,
                    async () => {
                        let result = await this.vm.allocate(this, tmpl);
                        cb(null, result);
                    },
                    cb
                )
            );
        });
    }

    tell(addr: Address, msg: Message): Future<void> {
        return Future.fromCallback(cb => {
            this.vm.scheduler.postJob(
                new JSJob(
                    this,
                    async () => {
                        this.vm.sendMessage(this, addr, msg);
                    },
                    cb
                )
            );
        });
    }

    receive<T = Message>(cases: TypeCase<T>[] = []): Future<T> {
        // TODO dispatch message received / wait event
        let match = new CaseFunction(
            empty(cases) ? [new Default(identity)] : cases
        );
        return Future.fromCallback(cb => {
            let job = new JSJob(
                this,
                () =>
                    Future.do(async () => {
                        if (empty(this.context.mailbox)) {
                            this.state = ThreadState.MSG_WAIT;
                            this.vm.scheduler.preemptJob(job);
                            return;
                        }

                        let msg = head(this.context.mailbox);
                        if (!match.test(msg)) {
                            //TODO dispatch message dropped event
                            this.state = ThreadState.MSG_WAIT;
                            this.vm.scheduler.preemptJob(job);
                            return;
                        }

                        let result = await match.apply(msg);
                        this.state = ThreadState.IDLE;
                        cb(null, result);
                    }),
                cb
            );
            this.vm.scheduler.postJob(job);
        });
    }

    die(): Future<void> {
        // TODO: dispatch event

        return Future.do(async () => {
            this.state = ThreadState.INVALID;

            this.vm.scheduler.dequeue(this);

            return Future.of(<void>undefined);
        });
    }

    deref(data: Data): Maybe<Type> {
        if (this.vm.registry.isRegistryAddress(data))
            return this.vm.registry.deref(data);

        return Maybe.of(data);
    }

    isValid() {
        return (
            this.state !== ThreadState.INVALID &&
            this.state !== ThreadState.ERROR
        );
    }

    resume(job: Job) {
        if (job.type === JobType.JS) {
            this.wait((<JSJob>job).fun);
            return;
        }
        //
        //TODO: dispatch event
        this.state = ThreadState.RUNNING;

        let { fun, args } = <VMJob>job;

        let frame = new StackFrame(
            makeFrameName(this, fun.name),
            this.script,
            this,
            nothing(),
            fun.foreign
                ? [op.LDN | this.script.info.indexOf(fun), op.CALL]
                : fun.code.slice(),
            args
        );

        this.frameStack = [frame];
        this.frameStackPointer = 0;
        this.returnPointer = 0;

        while (!empty(this.frameStack)) {
            let sp = this.frameStackPointer;

            let frame = <Frame>this.frameStack[sp];

            if (this.returnPointer != 0) frame.data.push(this.returnPointer);

            while (!frame.isFinished() && this.state === ThreadState.RUNNING) {
                // execute frame instructions
                let pos = frame.getPosition();
                let next = frame.code[pos] >>> 0;
                let opcode = next & op.OPCODE_MASK;
                let operand = next & op.OPERAND_MASK;

                // this.vm.log.opcode(this, frame, opcode, operand);

                // TODO: Error if the opcode is invalid, out of range etc.
                handlers[opcode](this, frame, operand);

                if (pos === frame.getPosition()) frame.advance();

                // frame pointer changed, another frame has been pushed
                // and needs to be executed.
                if (sp !== this.frameStackPointer) break;
            }

            // If this is true, give other threads a chance to execute while we
            // wait on an async task to complete.
            if (this.state === ThreadState.ASYNC_WAIT) return;

            // Handle the next frame.
            if (sp === this.frameStackPointer) {
                //TODO: dispatch frame exit event
                this.frameStackPointer--;
                this.returnPointer = <Data>frame.data.pop();
            }
        }

        //TODO: dispatch event
        this.state = ThreadState.IDLE;
    }

    exec<T>(name: string, args: Data[] = []): Future<Maybe<T>> {
        return Future.fromCallback(cb => {
            let { state, script } = this;

            if (state === ThreadState.INVALID)
                return cb(new Error('ERR_THREAD_INVALID_STATE'));

            if (state === ThreadState.ERROR)
                return cb(new Error('ERR_THREAD_ERROR_STATE'));

            let fun: FunInfo = <FunInfo>(
                script.info.find(
                    info => info.name === name && info.descriptor === TYPE_FUN
                )
            );

            if (!fun) return Future.raise(new errors.UnknownFunErr(name));

            this.vm.scheduler.postJob(new VMJob(this, fun, args, cb));
        });
    }
}

/**
 * makeFrameName produces a suitable name for a Frame given its function
 * name.
 */
export const makeFrameName = (
    thread: SharedThread,
    funName: string
): FrameName =>
    empty(thread.frameStack)
        ? `${thread.context.template.id}@${thread.context.aid}#${funName}`
        : `${tail(thread.frameStack).name}/${funName}`;
