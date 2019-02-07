import { Either } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../../context';
import { Message } from '../../message';
import { Template } from '../../template';
import { Address } from '../../address';
import { Operand, Op } from './op';
import { Value, Function, Foreign, Script } from './script';
import { Platform } from './';
export declare const TYPE_NUMBER = 0;
export declare const TYPE_STRING = 1;
export declare const TYPE_FUNCTION = 2;
export declare const TYPE_TEMPLATE = 3;
export declare const TYPE_MESSAGE = 4;
export declare const TYPE_FOREIGN = 5;
export declare const LOCATION_LITERAL = 0;
export declare const LOCATION_CONSTANTS = 1;
export declare const LOCATION_HEAP = 2;
export declare const LOCATION_LOCAL = 3;
/**
 * Type indicates the type of an Operand.
 *
 * One of TYPE_* constants.
 */
export declare enum Type {
    Number,
    String,
    Function,
    Template,
    Message,
    Foreign
}
/**
 * Location indicates where the value is stored.
 */
export declare enum Location {
    Literal,
    Constants,
    Heap,
    Local
}
/**
 * Field
 */
export declare enum Field {
    Value = 0,
    Type = 1,
    Location = 2
}
/**
 * Data type.
 *
 * Occurs on the stack and the locals table.
 *
 * 1: The value of the variable.
 * 2: The type of the variable.
 * 3: The location of the variable (literal, constant or hea[).
 */
export declare type Data = [number, Type, Location];
/**
 * Frame of execution.
 */
export declare class Frame<C extends Context, S extends Platform<C>> {
    actor: Address;
    context: Context;
    script: Script<C, S>;
    code: Op<C, S>[];
    data: Operand[];
    locals: Data[];
    heap: Value<C, S>[];
    ip: number;
    constructor(actor: Address, context: Context, script: Script<C, S>, code?: Op<C, S>[], data?: Operand[], locals?: Data[], heap?: Value<C, S>[], ip?: number);
    /**
     * seek advances the Frame's ip to the location specified.
     *
     * Generates an error if the seek is out of the code block's bounds.
     */
    seek(location: number): Either<Err, Frame<C, S>>;
    /**
     * allocate space on the heap for a value.
     */
    allocate(value: Value<C, S>, typ: Type): Data;
    /**
     * allocateTemplate
     */
    allocateTemplate(t: Template<C, S>): Data;
    /**
     * push onto the stack an Operand, indicating its type and storage location.
     */
    push(value: Operand, type: Type, location: Location): Frame<C, S>;
    /**
     * pushNumber onto the stack.
     */
    pushNumber(n: number): Frame<C, S>;
    /**
     * pushAddress onto the stack.
     *
     * (Value is stored on the heap)
     */
    pushAddress(addr: Address): Frame<C, S>;
    /**
     * pop an operand off the stack.
     */
    pop(): Data;
    peek(n?: number): Data;
    /**
     * resolve a value from it's location, producing
     * an error if it can not be found.
     */
    resolve(data: Data): Either<Err, Value<C, S>>;
    /**
     * resolveNumber
     */
    resolveNumber(data: Data): Either<Err, number>;
    /**
     * resolveAddress
     */
    resolveAddress(data: Data): Either<Err, Address>;
    /**
     * resolveFunction
     */
    resolveFunction(data: Data): Either<Err, Function<C, S>>;
    /**
     * resolveTemplate
     */
    resolveTemplate(data: Data): Either<Err, Template<C, S>>;
    /**
     * resolveMessage
     */
    resolveMessage(data: Data): Either<Err, Message>;
    /**
     * resolveForeign
     */
    resolveForeign(data: Data): Either<Err, Foreign<C, S>>;
}
