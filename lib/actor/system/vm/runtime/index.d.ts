import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Either } from '@quenk/noni/lib/data/either';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Address } from '../../../address';
import { FunInfo } from '../script/info';
import { Frame } from './stack/frame';
import { Script } from '../script';
import { PTValue } from '../type';
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
export declare type Operand = number;
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
 * Runtime for an actor.
 *
 * The VM executes scripts by passing them to Runtime's for execution. Opcodes
 * are executed one by one in sequence. A VM should not call execute more than
 * one script in the same Runtime.
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
     * invokeForeign invokes a foreign function.
     *
     * The frame specified is the parent frame that will receive it's result.
     */
    invokeForeign(c: Frame, f: FunInfo, args: PTValue[]): void;
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
     * runTask allows an async operation to be carried out by the Runtime.
     *
     * While awaiting the end of this operation, the VM should not execute
     * any additional scripts in the Runtime.
     *
     * This methods main purpose is to hook into async JS functions.
     */
    runTask(ft: Future<void>): void;
    /**
     * exec the Script passed to the Runtime.
     */
    exec(s: Script): Maybe<PTValue>;
}
