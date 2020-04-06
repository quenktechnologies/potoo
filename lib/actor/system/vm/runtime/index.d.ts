import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Either } from '@quenk/noni/lib/data/either';
import { Address } from '../../../address';
import { FunInfo } from '../script/info';
import { Frame } from './stack/frame';
import { PVM_Value, Script } from '../script';
import { Platform } from '../';
import { Heap } from './heap';
import { Context } from './context';
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
export declare const OPCODE_RANGE_END = 4278190080;
export declare const OPERAND_RANGE_START = 0;
export declare const OPERAND_RANGE_END = 16777215;
export declare const MAX_INSTRUCTION = 4294967295;
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
     * invokeMain invokes the main function of a script.
     */
    invokeMain(s: Script): void;
    /**
     * invokeForeign invokes a foreign function.
     *
     * The frame specified is the parent frame that will receive it's result.
     */
    invokeForeign(c: Frame, f: FunInfo, args: PVM_Value[]): void;
    /**
     * invokeVM invokes a VM function.
     *
     * The frame specified is the parent frame and arguments will be sourced
     * from its data stack.
     */
    invokeVM(p: Frame, f: FunInfo): void;
    /**
     * raise an error.
     */
    raise(e: Err): void;
    /**
     * terminate the Runtime.
     *
     * All child runtimes will be terminiated first.
     */
    terminate(): void;
    /**
     * kill attempts to terminate the Runtime for another actor.
     *
     * This operation fails if the actor is not in the current actor's
     * tree.
     */
    kill(target: Address): Either<Err, void>;
    /**
     * run executes all the pending frames of the Runtime.
     *
     * This method should be called after invokeMain().
     */
    run(): Maybe<PVM_Value>;
}
