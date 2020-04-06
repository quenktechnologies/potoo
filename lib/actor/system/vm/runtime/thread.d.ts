import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Context } from './context';
import { Address } from '../../../address';
import { Frame, Data } from './stack/frame';
import { FunInfo } from '../script/info';
import { PVM_Value, Script } from '../script';
import { Platform } from '../';
import { Heap } from './heap';
import { Runtime } from './';
/**
 * Thread is the Runtime implementation for exactly one actor.
 */
export declare class Thread implements Runtime {
    vm: Platform;
    heap: Heap;
    context: Context;
    self: Address;
    fstack: Frame[];
    rstack: Data[];
    sp: number;
    constructor(vm: Platform, heap: Heap, context: Context, self: Address, fstack: Frame[], rstack: Data[], sp?: number);
    raise(e: Err): void;
    invokeMain(s: Script): void;
    invokeVM(p: Frame, f: FunInfo): void;
    invokeForeign(p: Frame, f: FunInfo, args: PVM_Value[]): void;
    run(): Maybe<PVM_Value>;
}
