import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Either } from '@quenk/noni/lib/data/either';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Address } from '../../../address';
import { FunInfo } from '../script/info';
import { PVM_Value, Script } from '../script';
import { Platform } from '../';
import { Frame, Data } from './stack/frame';
import { Context } from './context';
import { Heap } from './heap';
import { Runtime } from './';
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
    invokeForeign(p: Frame, f: FunInfo, args: PVM_Value[]): void;
    terminate(): void;
    kill(target: Address): Either<Err, void>;
    exec(s: Script): Maybe<PVM_Value>;
    runTask(ft: Future<void>): void;
    run(): Maybe<PVM_Value>;
}
