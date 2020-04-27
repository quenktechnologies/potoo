import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Address } from '../../../address';
import { FunInfo, ForeignFunInfo } from '../script/info';
import { Script } from '../script';
import { Platform } from '../';
import { Frame, Data } from './stack/frame';
import { Context } from './context';
import { Heap } from './heap';
import { Runtime } from './';
import { PTValue } from '../type';
/**
 * Thread is the Runtime implementation for exactly one actor.
 */
export declare class Thread implements Runtime {
    vm: Platform;
    heap: Heap;
    context: Context;
    fstack: Frame[];
    rstack: Data[];
    sp: number;
    constructor(vm: Platform, heap: Heap, context: Context, fstack?: Frame[], rstack?: Data[], sp?: number);
    raise(e: Err): void;
    invokeVM(p: Frame, f: FunInfo): void;
    invokeForeign(p: Frame, f: ForeignFunInfo, args: PTValue[]): void;
    die(): Future<void>;
    kill(target: Address): void;
    exec(s: Script): Maybe<PTValue>;
    runTask(ft: Future<void>): void;
    run(): Maybe<PTValue>;
}
