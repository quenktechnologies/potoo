import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';
import { Frame, Data, FrameName } from '../../runtime/stack/frame';
import { Context } from '../../runtime/context';
import { FunInfo, ForeignFunInfo } from '../../script/info';
import { Script } from '../../script';
import { Platform } from '../../';
import { VMThread } from '../';
import { SharedScheduler } from './scheduler';
/**
 * Job serves a unit of work a SharedThread needs to execute.
 *
 * Execution of Jobs is intended to be sequential with no Job pre-empting any
 * other with the same thread. For this reason, Jobs are only executed when
 * provided by the scheduler.
 */
export declare class Job {
    thread: SharedThread;
    fun: FunInfo;
    args: Data[];
    constructor(thread: SharedThread, fun: FunInfo, args?: Data[]);
    /**
     * active indicates if the Job is already active or not.
     *
     * If a Job is active, a new StackFrame is not created.
     */
    active: boolean;
}
/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Code execution only takes place when the resume() method is invoked by the
 * SharedScheduler which takes care of managing which Job (and SharedThread)
 * is allowed to run at any point in time.
 */
export declare class SharedThread implements VMThread {
    vm: Platform;
    script: Script;
    scheduler: SharedScheduler;
    context: Context;
    constructor(vm: Platform, script: Script, scheduler: SharedScheduler, context: Context);
    fstack: Frame[];
    fsp: number;
    rp: Data;
    state: number;
    invokeVM(p: Frame, f: FunInfo): void;
    invokeForeign(frame: Frame, fun: ForeignFunInfo, args: Type[]): void;
    wait(task: Future<void>): void;
    raise(e: Err): void;
    die(): Future<void>;
    resume(job: Job): void;
    exec(name: string, args?: Data[]): void;
}
/**
 * makeFrameName produces a suitable name for a Frame given its function
 * name.
 */
export declare const makeFrameName: (thread: SharedThread, funName: string) => FrameName;
