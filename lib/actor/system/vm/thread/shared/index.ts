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
    THREAD_STATE_INVALID,
    THREAD_STATE_CONTINUE
} from '../';
import { Job, SharedThreadRunner } from './runner';

/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Actual code execution takes place in a SharedThreadRunner which queues up
 * Job on behalf every SharedThread in the system.
 */
export class SharedThread implements VMThread {

    constructor(
        public vm: Platform,
        public script: Script,
        public runner: SharedThreadRunner,
        public context: Context) { }

    fstack: Frame[] = [];

    fsp = 0;

    rp: Data = 0;

    state = THREAD_STATE_IDLE;

    /**
     * makeFrameName produces a suitable name for a Frame given its function 
     * name.
     */
    makeFrameName(funName: string): FrameName {

        return empty(this.fstack) ?
            `${this.context.template.id}@${this.context.aid}#${funName}` :
            `${tail(this.fstack).name}/${funName}`;

    }

    invokeVM(p: Frame, f: FunInfo) {

        let frm = new StackFrame(this.makeFrameName(f.name), p.script,
            this, just(p), f.code.slice());

        for (let i = 0; i < f.argc; i++)
            frm.push(p.pop());

        this.fstack.push(frm);

        this.fsp = this.fstack.length - 1;

        this.runner.run();

    }

    invokeForeign(frame: Frame, fun: ForeignFunInfo, args: Type[]) {

        //TODO: Support async functions.   
        let val = fun.exec.apply(null, [this, ...args]);

        frame.push(this.vm.heap.intern(frame, val));

        this.runner.run();

    }

    wait(task: Future<void>) {

        this.state = THREAD_STATE_WAIT;

        let onError = (e: Error) => {

            this.state = THREAD_STATE_ERROR;

            this.raise(e);

        };

        let onSuccess = () => {

            this.state = THREAD_STATE_CONTINUE;

            this.runner.run(); // Continue execution.

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

        this.runner.dequeue(this);

        return doFuture(function*() {

            let ret = that.context.actor.stop();

            if (ret) yield ret;

            that.vm.heap.threadExit(that);

            return pure(<void>undefined);

        });

    }

    restore({ fun, args }: Job) {

        let frame = new StackFrame(
            this.makeFrameName(fun.name),
            this.script,
            this,
            nothing(),
            fun.foreign ?
                [op.LDN | this.script.info.indexOf(fun), op.CALL] :
                fun.code.slice(),
        );

        frame.data = args.map(arg => isHeapAddress(arg) ?
            this.vm.heap.move(arg, frame.name)
            : arg);

        this.fstack = [frame];
        this.fsp = 0;
        this.rp = 0;
        this.state = THREAD_STATE_RUN;

    }

    nextFrame(rp: Data) {

        this.vm.heap.frameExit(<Frame>this.fstack.pop());
        this.fsp--;
        this.rp = rp;
        this.state = THREAD_STATE_IDLE;

    }

    exec(name: string, args: Data[] = []) {

        let { script } = this;

        let fun: FunInfo = <FunInfo>script.info.find(info =>
            (info.name === name) && (info.descriptor === TYPE_FUN));

        if (!fun)
            return this.raise(new errors.UnknownFunErr(name));

        this.runner.postJob(new Job(this, fun, args));

    }

}
