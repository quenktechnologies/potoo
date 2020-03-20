import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../../../context';
import { Address } from '../../../address';
import { Frame } from './stack/frame';
import { FunInfo } from '../script/info';
import { PVM_Value } from '../script';
import { Platform } from '../';
import { Heap } from './heap';
import { Runtime } from './';
/**
 * Proc is a Runtime implementation for exactly one actor.
 */
export declare class Proc implements Runtime {
    vm: Platform;
    heap: Heap;
    context: Context;
    self: Address;
    stack: Frame[];
    sp: number;
    constructor(vm: Platform, heap: Heap, context: Context, self: Address, stack?: Frame[], sp?: number);
    raise(_: Err): void;
    call(c: Frame, f: FunInfo, args: PVM_Value[]): void;
    run(): void;
}
