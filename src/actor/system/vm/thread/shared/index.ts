import * as errors from '../../runtime/error';
import * as op from '../../runtime/op';

import { Err } from '@quenk/noni/lib/control/error';
import { Future, doFuture, pure } from '@quenk/noni/lib/control/monad/future';
import { empty, tail } from '@quenk/noni/lib/data/array';
import { just, nothing } from '@quenk/noni/lib/data/maybe';
import { Type } from '@quenk/noni/lib/data/type';

import { Frame, StackFrame, Data, FrameName } from '../../runtime/stack/frame';
import { isHeapAddress } from '../../runtime/heap/ledger';
import { Context } from '../../runtime/context';
import { handlers } from '../../runtime/op';
import { FunInfo, ForeignFunInfo } from '../../script/info';
import { Script } from '../../script';
import { TYPE_FUN } from '../../type';
import { Platform } from '../../';
import {
    VMThread,
    THREAD_STATE_IDLE,
    THREAD_STATE_RUN,
    THREAD_STATE_WAIT,
    THREAD_STATE_ERROR,
    THREAD_STATE_INVALID
} from '../';
import { SharedScheduler } from './scheduler';
import { OPCODE_MASK, OPERAND_MASK } from '../../runtime';

/**
 * Job serves a unit of work a SharedThread needs to execute.
 *
 * Execution of Jobs is intended to be sequential with no Job pre-empting any
 * other with the same thread. For this reason, Jobs are only executed when
 * provided by the scheduler.
 */
export class Job {

    constructor(
        public thread: SharedThread,
        public fun: FunInfo,
        public args: Data[] = []) { }

    /**
     * active indicates if the Job is already active or not.
     *
     * If a Job is active, a new StackFrame is not created.
     */
    active = false;

}

/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Code execution only takes place when the resume() method is invoked by the
 * SharedScheduler which takes care of managing which Job (and SharedThread)
 * is allowed to run at any point in time.
 */
export class SharedThread implements VMThread {

    constructor(
        public vm: Platform,
        public script: Script,
        public scheduler: SharedScheduler,
        public context: Context) { }

    fstack: Frame[] = [];

    fsp = 0;

    rp: Data = 0;

    state = THREAD_STATE_IDLE;

    invokeVM(p: Frame, f: FunInfo) {

        let frm = new StackFrame(makeFrameName(this, f.name), p.script,
            this, just(p), f.code.slice());

        for (let i = 0; i < f.argc; i++)
            frm.push(p.pop());

        this.fstack.push(frm);

        this.fsp = this.fstack.length - 1;

        this.scheduler.run();

    }

    invokeForeign(frame: Frame, fun: ForeignFunInfo, args: Type[]) {

        //TODO: Support async functions.   
        let val = fun.exec.apply(null, [this, ...args]);

        frame.push(this.vm.heap.intern(frame, val));

        this.scheduler.run();

    }

    wait(task: Future<void>) {

        this.state = THREAD_STATE_WAIT;

        let onError = (e: Error) => {

            this.state = THREAD_STATE_ERROR;

            this.raise(e);

        };

        let onSuccess = () => {

            this.state = THREAD_STATE_IDLE;

            this.scheduler.run(); // Continue execution if stopped.

        };

        task.fork(onError, onSuccess);

    }

    raise(e: Err) {

        this.state = THREAD_STATE_ERROR;

        this.vm.raise(this.context.actor, e);

    }

    die(): Future<void> {

        let that = this;

        this.state = THREAD_STATE_INVALID;

        this.scheduler.dequeue(this);

        return doFuture(function*() {

            let ret = that.context.actor.stop();

            if (ret) yield ret;

            that.vm.heap.threadExit(that);

            return pure(<void>undefined);

        });

    }

    resume(job: Job) {

        this.state = THREAD_STATE_RUN;

        if (!job.active) {

            job.active = true;

            let { fun, args } = job;

            let frame = new StackFrame(
                makeFrameName(this, fun.name),
                this.script,
                this,
                nothing(),
                fun.foreign ?
                    [op.LDN | this.script.info.indexOf(fun), op.CALL] :
                    fun.code.slice());

            frame.data = args.map(arg => isHeapAddress(arg) ?
                this.vm.heap.move(arg, frame.name)
                : arg);

            this.fstack = [frame];
            this.fsp = 0;
            this.rp = 0;

        }

        while (!empty(this.fstack)) {

            let sp = this.fsp;

            let frame = <Frame>this.fstack[sp];

            if (this.rp != 0) frame.data.push(this.rp);

            while (!frame.isFinished() &&
                (this.state === THREAD_STATE_RUN)) {

                // execute frame instructions
                let pos = frame.getPosition();
                let next = (frame.code[pos] >>> 0);
                let opcode = next & OPCODE_MASK;
                let operand = next & OPERAND_MASK;

                this.vm.log.opcode(this, frame, opcode, operand);

                // TODO: Error if the opcode is invalid, out of range etc.
                handlers[opcode](this, frame, operand);

                if (pos === frame.getPosition()) frame.advance();

                // frame pointer changed, another frame has been pushed
                // and needs to be executed.
                if (sp !== this.fsp) break;

            }

            // If this is true, give other threads a chance to execute while we
            // wait on an async task to complete.
            if (this.state === THREAD_STATE_WAIT) return;

            // Handle the next frame.
            if (sp === this.fsp) {

                this.vm.heap.frameExit(<Frame>this.fstack.pop());
                this.fsp--;
                this.rp = <Data>frame.data.pop();

            }

        }

        this.state = THREAD_STATE_IDLE;

    }

    exec(name: string, args: Data[] = []) {

        let { script } = this;

        let fun: FunInfo = <FunInfo>script.info.find(info =>
            (info.name === name) && (info.descriptor === TYPE_FUN));

        if (!fun) return this.raise(new errors.UnknownFunErr(name));

        this.scheduler.postJob(new Job(this, fun, args));

    }

}

/**
 * makeFrameName produces a suitable name for a Frame given its function 
 * name.
 */
export const makeFrameName = (thread: SharedThread, funName: string)
    : FrameName => empty(thread.fstack) ?
        `${thread.context.template.id}@${thread.context.aid}#${funName}` :
        `${tail(thread.fstack).name}/${funName}`;
