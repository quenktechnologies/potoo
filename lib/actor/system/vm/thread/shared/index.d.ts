import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Frame, Data, FrameName } from '../../runtime/stack/frame';
import { Context } from '../../runtime/context';
import { FunInfo, ForeignFunInfo } from '../../script/info';
import { Script } from '../../script';
import { Foreign, PTValue } from '../../type';
import { Platform } from '../../';
import { VMThread } from '../';
import { ExecutionFrame, SharedThreadRunner } from './runner';
/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Actual code execution takes place in a SharedThreadRunner which queues up
 * ExecutionFrame on behalf every SharedThread in the system.
 */
export declare class SharedThread implements VMThread {
    vm: Platform;
    script: Script;
    runner: SharedThreadRunner;
    context: Context;
    constructor(vm: Platform, script: Script, runner: SharedThreadRunner, context: Context);
    fstack: Frame[];
    fsp: number;
    rp: Data;
    state: number;
    /**
     * makeFrameName produces a suitable name for a Frame given its function
     * name.
     */
    makeFrameName(funName: string): FrameName;
    invokeVM(p: Frame, f: FunInfo): void;
    invokeForeign(frame: Frame, fun: ForeignFunInfo, args: PTValue[]): void;
    wait(task: Future<void>): void;
    raise(e: Err): void;
    die(): Future<void>;
    restore(eframe: ExecutionFrame): void;
    processNextFrame(rp: Data): void;
    exec(name: string, args: Foreign[]): void;
}
