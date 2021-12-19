import * as errors from '../../runtime/error';
import * as op from '../../runtime/op';

import { Err } from '@quenk/noni/lib/control/error';
import { Future, doFuture, pure } from '@quenk/noni/lib/control/monad/future';

import { Frame, StackFrame, Data } from '../../runtime/stack/frame';
import { Context } from '../../runtime/context';
import { FunInfo, ForeignFunInfo } from '../../script/info';
import { Script } from '../../script';
import { PTValue, TYPE_FUN } from '../../type';
import { Platform } from '../../';
import {
    VMThread,
    THREAD_STATE_IDLE,
    THREAD_STATE_RUN,
    THREAD_STATE_WAIT,
    THREAD_STATE_ERROR
} from '../';
import { ExecutionFrame, SharedThreadRunner } from './runner';

/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Actual code execution takes place in a SharedThreadRunner which queues up
 * ExecutionFrame on behalf every SharedThread in the system.
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

    invokeVM(p: Frame, f: FunInfo) {

        let frm = new StackFrame(f.name, p.script, this, f.code.slice());

        for (let i = 0; i < f.argc; i++)
            frm.push(p.pop());

        this.fstack.push(frm);

        this.fsp = this.fstack.length - 1;

        this.runner.run();

    }

    invokeForeign(frame: Frame, fun: ForeignFunInfo, args: PTValue[]) {

        //TODO: Support async functions.   

        let val = fun.exec.apply(null, [this, ...args]);

        frame.push(this.vm.heap.getAddress(val));

        this.runner.run();

    }

    wait(task: Future<void>) {

        this.state = THREAD_STATE_WAIT;

        let onError = (e: Error) => {

            this.state = THREAD_STATE_ERROR;

            this.raise(e);

        };

        let onSuccess = () => {

            this.state = THREAD_STATE_IDLE;

            this.runner.run(); // Continue execution.

        };

        task.fork(onError, onSuccess);

    }

    raise(e: Err) {

        this.vm.raise(this.context.actor, e);

    }

    die(): Future<void> {

        let that = this;

        this.runner.dequeue(this);

        return doFuture(function*() {

            let ret = that.context.actor.stop();

            return (ret != null) ? <Future<void>>ret : pure(<void>undefined);

        });

    }

    restore(eframe: ExecutionFrame) {

        this.fstack = eframe.fstack;
        this.fsp = eframe.fsp;
        this.rp = eframe.rp;
        this.state = THREAD_STATE_RUN;

    }

    processNextFrame(rp: Data) {

        this.fstack.pop();
        this.fsp--;
        this.rp = rp;
        this.state = THREAD_STATE_IDLE;

    }

    exec(name: string, args: Data[]) {

        let { script } = this;

        let fun: FunInfo = <FunInfo>script.info.find(info =>
            (info.name === name) && info.descriptor === TYPE_FUN);

        if (!fun)
            return this.raise(new errors.UnknownFunErr(name));

        let frame = new StackFrame(
            fun.name,
            script,
            this,
            fun.foreign ?
                [op.LDN | this.script.info.indexOf(fun), op.CALL] :
                fun.code.slice(),
            args.slice()
        );

        this.runner.enqueue(new ExecutionFrame(this, [frame]));

        this.runner.run();

    }

}
