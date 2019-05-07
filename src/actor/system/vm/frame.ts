import * as error from './error';
import { Either, left, right } from '@quenk/noni/lib/data/either';
import { fromNullable } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../../context';
import { Message } from '../../message';
import { Template } from '../../template';
import { Address } from '../../address';
import { System } from '../';
import { Operand, Op } from './op';
import { Value, Function, Foreign, Script } from './script';

//Type indicators.
export const TYPE_NUMBER = 0x0;
export const TYPE_STRING = 0x1;
export const TYPE_FUNCTION = 0x2;
export const TYPE_TEMPLATE = 0x3;
export const TYPE_MESSAGE = 0x4;
export const TYPE_FOREIGN = 0x5;

//Storage locations.
export const LOCATION_LITERAL = 0x0;
export const LOCATION_CONSTANTS = 0x1;
export const LOCATION_HEAP = 0x2;
export const LOCATION_LOCAL = 0x3;
export const LOCATION_MAILBOX = 0x4;

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

    Message = TYPE_MESSAGE,

    Foreign = TYPE_FOREIGN

}

/**
 * Location indicates where the value is stored.
 */
export enum Location {

    Literal = LOCATION_LITERAL,

    Constants = LOCATION_CONSTANTS,

    Heap = LOCATION_HEAP,

    Local = LOCATION_LOCAL,

    Mailbox = LOCATION_MAILBOX

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
 * Frame of execution.
 */
export class Frame {

    constructor(
        public actor: Address,
        public context: Context,
        public script: Script,
        public code: Op[] = [],
        public data: Operand[] = [],
        public locals: Data[] = [],
        public heap: Value[] = [],
        public ip = 0) { }

    /**
     * seek advances the Frame's ip to the location specified.
     *
     * Generates an error if the seek is out of the code block's bounds.
     */
    seek(location: number): Either<Err, Frame> {

        if ((location < 0) || (location >= (this.code.length)))
            return left(new error.JumpOutOfBoundsErr(location,
                this.code.length - 1));

        this.ip = location;

        return right(this);

    }

    /**
     * allocate space on the heap for a value.
     */
    allocate(value: Value, typ: Type): Data {

        this.heap.push(value);
        return [this.heap.length - 1, typ, Location.Heap];

    }

    /**
     * allocateTemplate
     */
    allocateTemplate(t: Template<System>): Data {

        return this.allocate(t, Type.Template);

    }

    /**
     * push onto the stack an Operand, indicating its type and storage location.
     */
    push(value: Operand, type: Type, location: Location): Frame {

        this.data.push(location);
        this.data.push(type);
        this.data.push(value);
        return this;

    }

    /**
     * pushNumber onto the stack.
     */
    pushNumber(n: number): Frame {

        this.push(n, Type.Number, Location.Literal);
        return this;

    }

    /**
     * pushAddress onto the stack.
     *
     * (Value is stored on the heap)
     */
    pushAddress(addr: Address): Frame {

        this.heap.push(addr);
        this.push(this.heap.length - 1, Type.String, Location.Heap);
        return this;

    }

    /**
     * pop an operand off the stack.
     */
    pop(): Data {

        return [
            <number>this.data.pop(),
            <Type>this.data.pop(),
            <Location>this.data.pop()
        ];

    }

    peek(n = 0): Data {

        let len = this.data.length;
        let offset = n * 3;

        return [
            <number>this.data[len - (1 + offset)],
            <Type>this.data[len - (2 + offset)],
            <Location>this.data[len - (3 + offset)]
        ];

    }

    /**
     * resolve a value from it's location, producing 
     * an error if it can not be found.
     */
    resolve(data: Data): Either<Err, Value> {

        let nullErr = () => left(new error.NullPointerErr(data));

        switch (data[Field.Location]) {

            case Location.Literal:
                return right(data[Field.Value]);

            case Location.Constants:
                return fromNullable(this.script.constants[data[Field.Type]])
                    .chain(typ => fromNullable(typ[data[Field.Value]]))
                    .map(v => right<Err, Value>(v))
                    .orJust(nullErr)
                    .get();

            case Location.Local:
                return fromNullable(this.locals[data[Field.Value]])
                    .map(d => this.resolve(d))
                    .orJust(nullErr)
                    .get();

            case Location.Heap:
                return fromNullable(this.heap[data[Field.Value]])
                    .map(v => right<Err, Value>(v))
                    .orJust(nullErr)
                    .get();

            case Location.Mailbox:
                return this
                    .context
                    .mailbox
                    .chain(m => fromNullable(m[data[Field.Value]]))
                    .map(v => right<Err, Value>(v))
                    .get()

            default:
                return nullErr();

        }

    }

    /**
     * resolveNumber
     */
    resolveNumber(data: Data): Either<Err, number> {

        if (data[Field.Type] !== Type.Number)
            return left(new error.TypeErr(Type.Number, data[Field.Type]));

        return this.resolve(data);

    }

    /**
     * resolveAddress
     */
    resolveAddress(data: Data): Either<Err, Address> {

        if (data[Field.Type] !== Type.String)
            return left(new error.TypeErr(Type.String, data[Field.Type]));

        return this.resolve(data);

    }

    /**
     * resolveFunction
     */
    resolveFunction(data: Data): Either<Err, Function> {

        if (data[Field.Type] !== Type.Function)
            return left(new error.TypeErr(Type.Function, data[Field.Type]));

        return this.resolve(data);

    }

    /**
     * resolveTemplate
     */
    resolveTemplate(data: Data): Either<Err, Template<System>> {

        if (data[Field.Type] !== Type.Template)
            return left(new error.TypeErr(Type.Template, data[Field.Type]));

        return this.resolve(data);

    }

    /**
     * resolveMessage
     */
    resolveMessage(data: Data): Either<Err, Message> {

        if (data[Field.Type] !== Type.Message)
            return left(new error.TypeErr(Type.Message, data[Field.Type]));

        return this.resolve(data);

    }

    /**
     * resolveForeign
     */
    resolveForeign(data: Data): Either<Err, Foreign> {

        if (data[Field.Type] !== Type.Foreign)
            return left(new error.TypeErr(Type.Foreign, data[Field.Type]));

        return this.resolve(data);

    }

}
