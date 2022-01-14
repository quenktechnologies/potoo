import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';
import { Frame, Data, FrameName } from '../../runtime/stack/frame';
import { Context } from '../../runtime/context';
import { FunInfo, ForeignFunInfo } from '../../script/info';
import { Script } from '../../script';
import { Platform } from '../../';
import { VMThread } from '../';
import { Job, SharedThreadRunner } from './runner';
/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Actual code execution takes place in a SharedThreadRunner which queues up
 * Job on behalf every SharedThread in the system.
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
    invokeForeign(frame: Frame, fun: ForeignFunInfo, args: Type[]): void;
    wait(task: Future<void>): void;
    raise(e: Err): void;
    die(): Future<void>;
    restore({ fun, args }: Job): void;
    nextFrame(rp: Data): void;
    exec(name: string, args?: Data[]): void;
}
