import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../../../context';
import { Address } from '../../../address';
import { Frame } from './stack/frame';
import { FunInfo } from '../script/info';
import { PVM_Value } from '../script';
import { Platform } from '../';
import { Heap } from './heap';
/**
 * Opcode
 */
export declare type Opcode = number;
/**
 * Operand
 */
export declare type Operand = OperandU8 | OperandU16;
/**
 * OperandU8
 */
export declare type OperandU8 = number;
/**
 * OperandU16
 */
export declare type OperandU16 = number;
/**
 * Instruction
 */
export declare type Instruction = number;
export declare const OPCODE_MASK = 4278190080;
export declare const OPERAND_MASK = 16777215;
export declare const OPCODE_RANGE_START = 16777216;
export declare const OPCODE_RANGE_END = 2130706432;
export declare const OPERAND_RANGE_START = 0;
export declare const OPERAND_RANGE_END = 16777215;
export declare const MAX_INSTRUCTION = 2147483647;
/**
 * Runtime is responsible for executing the instructions an actor's script
 * requests.
 *
 * It also allows for appropriate access to the rest of the system.
 */
export interface Runtime {
    /**
     * vm
     */
    vm: Platform;
    /**
     * heap
     */
    heap: Heap;
    /**
     * context
     */
    context: Context;
    /**
     * call a function in the current frame context.
     */
    call(c: Frame, f: FunInfo, args: PVM_Value[]): void;
    /**
     * raise an error.
     */
    raise(e: Err): void;
}
/**
 * This is a Runtime implementation for exactly one actor.
 */
export declare class This implements Runtime {
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
