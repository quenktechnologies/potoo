import * as error from './error';
import { Either, left, right } from '@quenk/noni/lib/data/either';
import { fromNullable } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../../context';
import { Message } from '../../message';
import { Template } from '../../template';
import { System } from '../';
import { Operand, Op } from './op';
import { Function, Script } from './script';

//Type indicators.
export const TYPE_NUMBER = 0x0;
export const TYPE_STRING = 0x1;
export const TYPE_FUNCTION = 0x2;
export const TYPE_TEMPLATE = 0x3;
export const TYPE_MESSAGE = 0x4;

//Storage locations.
export const LOCATION_LITERAL = 0x0;
export const LOCATION_CONSTANTS = 0x1;
export const LOCATION_HEAP = 0x2;
export const LOCATION_LOCAL = 0x3;

/**
 * Type indicates the type of an Operand.
 *
 * One of TYPE_* constants.
 */
export enum Type {

    Number = TYPE_NUMBER,

    String = TYPE_STRING,

    Function = TYPE_FUNCTION,

    Template = TYPE_TEMPLATE,

    Message = TYPE_MESSAGE

}

/**
 * Location indicates where the value is stored.
 */
export enum Location {

    Literal = LOCATION_LITERAL,

    Constants = LOCATION_CONSTANTS,

    Heap = LOCATION_HEAP,

    Local = LOCATION_LOCAL

}

/**
 * Field 
 */
export enum Field {

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
export type Data = [number, Type, Location];

/**
 * Value correspond to the types of the VM's type system.
 */
export type Value<C extends Context, S extends System<C>>
    = number
    | string
    | Function<C, S>
    | Template<C, S>
    | Message
    ;

/**
 * Frame of execution.
 */
export class Frame<C extends Context, S extends System<C>> {

    constructor(
        public script: Script<C, S>,
        public context: Context,
        public code: Op<C, S>[] = [],
        public data: Operand[] = [],
        public locals: Data[] = [],
        public heap: Value<C, S>[] = [],
        public ip = 0) { }

    /**
     * push onto the stack an Operand, indicating its type and storage location.
     */
    push(value: Operand, type: Type, location: Location): Frame<C, S> {

        this.data.push(value, type, location);
        return this;

    }

    /**
     * pop an operand off the stack.
     */
    pop(): Data {

        return <Data>[
            <Location>this.data.pop(),
            <Type>this.data.pop(),
            <number>this.data.pop()
        ].reverse();

    }

    /**
     * resolve a value from it's location, producing 
     * an error if it can not be found.
     */
    resolve(data: Data): Either<Err, Value<C, S>> {

        let nullErr = () => left(new error.NullPointerErr(data));

        switch (data[Field.Location]) {

            case Location.Literal:
                return right(data[Field.Value]);

            case Location.Constants:
            return fromNullable(this.script.constants[data[Field.Type]])
              .chain(typ => fromNullable(typ[data[Field.Value]]))
              .map(v => right<Err,  Value<C,S>>(v))
                    .orJust(nullErr)
                    .get();

            case Location.Local:
                return fromNullable(this.locals[data[Field.Value]])
                    .map(d => this.resolve(d))
                    .get();

            case Location.Heap:
                return fromNullable(this.heap[data[Field.Value]])
                    .map(v => right<Err, Value<C, S>>(v))
                    .orJust(nullErr)
                    .get();

            default:
                return nullErr();

        }

    }

}
