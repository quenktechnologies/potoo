import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Frame } from './stack/frame';
import { FunInfo } from '../script/info';
import { PVM_Value, Script } from '../script';
import { Platform } from '../';
import { Heap } from './heap';
import { Context } from './context';

/**
 * Opcode
 */
export type Opcode = number;

/**
 * Operand
 */
export type Operand = OperandU8 | OperandU16;

/**
 * OperandU8
 */
export type OperandU8 = number;

/**
 * OperandU16
 */
export type OperandU16 = number;

/**
 * Instruction
 */
export type Instruction = number;

export const OPCODE_MASK = 0xFF000000;

export const OPERAND_MASK = 0x00FFFFFF;

export const OPCODE_RANGE_START = 0x1000000;

export const OPCODE_RANGE_END = 0xFF000000;

export const OPERAND_RANGE_START = 0x0;

export const OPERAND_RANGE_END = 0xffffff;

export const MAX_INSTRUCTION = 0xFFFFFFFF;

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
    vm: Platform,

    /**
     * heap
     */
    heap: Heap,

    /**
     * context
     */
    context: Context

    /**
     * invokeMain invokes the main function of a script.
     */
    invokeMain(s: Script): void

    /**
     * invokeForeign invokes a foreign function.
     *
     * The frame specified is the parent frame that will receive it's result.
     */
    invokeForeign(c: Frame, f: FunInfo, args: PVM_Value[]): void

    /**
     * invokeVM invokes a VM function.
     *
     * The frame specified is the parent frame and arguments will be sourced
     * from its data stack.
     */
    invokeVM(p: Frame, f: FunInfo): void

    /**
     * raise an error.
     */
    raise(e: Err): void

    /**
     * run executes all the pending frames of the Runtime.
     *
     * This method should be called after invokeMain().
     */
    run(): Maybe<PVM_Value>

}
