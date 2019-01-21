import { Either } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../../context';
import { Message } from '../../message';
import { Template } from '../../template';
import { System } from '../';
import { Operand, Op } from './op';
import { Function, Script } from './script';
export declare const TYPE_NUMBER = 0;
export declare const TYPE_STRING = 1;
export declare const TYPE_FUNCTION = 2;
export declare const TYPE_TEMPLATE = 3;
export declare const TYPE_MESSAGE = 4;
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
    Message
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
 * Value correspond to the types of the VM's type system.
 */
export declare type Value<C extends Context, S extends System<C>> = number | string | Function<C, S> | Template<C, S> | Message;
/**
 * Frame of execution.
 */
export declare class Frame<C extends Context, S extends System<C>> {
    script: Script<C, S>;
    context: Context;
    code: Op<C, S>[];
    data: Operand[];
    locals: Data[];
    heap: Value<C, S>[];
    ip: number;
    constructor(script: Script<C, S>, context: Context, code?: Op<C, S>[], data?: Operand[], locals?: Data[], heap?: Value<C, S>[], ip?: number);
    /**
     * push onto the stack an Operand, indicating its type and storage location.
     */
    push(value: Operand, type: Type, location: Location): Frame<C, S>;
    /**
     * pop an operand off the stack.
     */
    pop(): Data;
    /**
     * resolve a value from it's location, producing
     * an error if it can not be found.
     */
    resolve(data: Data): Either<Err, Value<C, S>>;
}
