import * as indexes from '../../script';
import * as error from '../error';

import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { fromNullable, Maybe } from '@quenk/noni/lib/data/maybe';
import { tail } from '@quenk/noni/lib/data/array';

import { Address } from '../../../../address';
import { Context } from '../../../../context';
import {
    Script,
    PVM_Value,
    PVM_Template,
    PVM_Message,
    PVM_Object,
    PVM_Function,
    ConsInfo,
    PVM_Receiver
} from '../../script';
import { Instruction, OperandU8, OperandU16, Operand } from '../';
import { Heap } from '../heap';

export const DATA_RANGE_TYPE_HIGH = 0x7F000000;
export const DATA_RANGE_TYPE_LOW = 0x1000000;
export const DATA_RANGE_TYPE_STEP = 0x1000000;

// Used to extract the desired part via &
export const DATA_MASK_TYPE = 0xFF000000;
export const DATA_MASK_VALUE8 = 0xFF;
export const DATA_MASK_VALUE16 = 0xFFFF;
export const DATA_MASK_VALUE24 = 0xFFFFFF;
export const DATA_MASK_VALUE32 = 0xFFFFFFFF;

export const DATA_MAX_SIZE = 0x7FFFFFFF;
export const DATA_MAX_SAFE_UINT32 = 0x7fffffff;

//Type indicators.
export const DATA_TYPE_UINT8 = DATA_RANGE_TYPE_STEP;
export const DATA_TYPE_UINT16 = DATA_RANGE_TYPE_STEP * 2;
export const DATA_TYPE_STRING = DATA_RANGE_TYPE_STEP * 15;
export const DATA_TYPE_FUNCTION = DATA_RANGE_TYPE_STEP * 20;
export const DATA_TYPE_OBJECT = DATA_RANGE_TYPE_STEP * 25;
export const DATA_TYPE_ARRAY = DATA_RANGE_TYPE_STEP * 26
export const DATA_TYPE_RECEIVER = DATA_RANGE_TYPE_STEP * 27
export const DATA_TYPE_LOCAL = DATA_RANGE_TYPE_STEP * 28;
export const DATA_TYPE_MESSAGE = DATA_RANGE_TYPE_STEP * 29;

/**
 * Data is the type of values that can appear on a Frame's data stack.
 *
 * It is a 32bit unsigned integer in the range 0x00000000-0x7FFFFFFF
 *
 * Typically, the  highest byte is used to indicate the type of the data
 * in realtion to storage location and the remaining bytes store value.
 *
 * 11111111        111111111111111111111111
 * <type/location> <     value      >
 *
 * The actual interpretation of the location and value part are dependant on
 * the type.
 */
export type Data = number;

/**
 * typeMaps maps a type to its index in the contants pool.
 */
export const typeMaps: { [key: number]: number } = {

    [DATA_TYPE_STRING]: indexes.CONSTANTS_INDEX_STRING,

}

/**
 * Frame is the context for currently executing op codes.
 *
 * It provides methods for manipulating the stack common to each op code as 
 * well as access to other components of the system.
 */
export class Frame {

    constructor(
        public actor: Address,
        public context: Context,
        public script: Script,
        public heap: Heap = new Heap(),
        public code: Instruction[] = [],
        public data: Data[] = [],
        public locals: Data[] = [],
        public ip = 0) { }

    /**
     * push a value onto the data stack.
     * 
     * Care should be taken when using this method to ensure the value has 
     * the correct bits set.
     */
    push(d: Data): Frame {

        this.data.push(d);
        return this;

    }

    /**
     * pushUInt8 pushes an unsigned 8bit integer onto the data stack.
     */
    pushUInt8(value: OperandU8): Frame {

        return this.push(
            value &
            DATA_MASK_VALUE8 |
            DATA_TYPE_UINT8);

    }

    /**
     * pushUInt16 pushes an unsigned 16bit integer onto the data stack.
     */
    pushUInt16(value: OperandU16): Frame {

        return this.push(
            value &
            DATA_MASK_VALUE16 |
            DATA_TYPE_UINT16);

    }

    /**
     * pushUInt32 pushes an unsigned 32bit integer onto the data stack.
     */
    pushUInt32(value: Operand): Frame {

        return this.push(value & DATA_MASK_VALUE32);

    }

    /**
     * pushString from the constant pool onto the data stack.
     */
    pushString(idx: Operand): Frame {

        return this.push(idx | DATA_TYPE_STRING);

    }

    /**
     * pushFunctions from the funs section onto the stack.
     */
    pushFunction(idx: OperandU16): Frame {

        return this.push(idx | DATA_TYPE_FUNCTION);

    }

    /**
     * pushReceiver from the receivers section onto the stack.
     */
    pushReceiver(idx: OperandU16): Frame {

        return this.push(idx | DATA_TYPE_RECEIVER);

    }

    /**
     * pushMessage from the receivers section onto the stack.
     */
    pushMessage(): Frame {

        return this.push(0 | DATA_TYPE_MESSAGE);

    }

    /**
     * peek at the top of the data stack.
     */
    peek(): Maybe<Data> {

        //TODO: Return 0 instead of Maybe?
        return fromNullable(tail(this.data));

    }

    /**
     * peekConstructor peeks and resolves the constructor for the object 
     * reference at the top of the stack.
     */
    peekConstructor(): Either<Err, ConsInfo> {

        let mword = this.peek();

        if (mword.isNothing()) return left(new error.NullPointerErr(0));

        let word = DATA_MASK_VALUE24 & mword.get();

        let info = this.script.cons[DATA_MASK_VALUE24 & word];

        if (info == null) return left(new error.NullPointerErr(word));

        return right(info);

    }

    /**
     * resolve a value from its reference.
     *
     * An error will be produced if the value cannot be resolved.
     */
    resolve(data: Data): Either<Err, PVM_Value> {

        let { script, context } = this;

        let typ = data & DATA_MASK_TYPE;

        let value = data & DATA_MASK_VALUE24;

        switch (typ) {

            case DATA_TYPE_STRING:

                let mstr = fromNullable(
                    script.constants[indexes.CONSTANTS_INDEX_STRING][value]);

                return right(mstr.get());

            case DATA_TYPE_FUNCTION:

                let info = this.script.funs[value];

                if (info == null)
                    return left(new error.MissingFunInfoErr(value));

                return right(info);

            case DATA_TYPE_RECEIVER:

                let r = this.script.receivers[value];

                return (r == null) ?
                    left(new error.MissingFunInfoErr(value)) :
                    right(r);

            case DATA_TYPE_OBJECT:
            case DATA_TYPE_ARRAY:

                let mO = this.heap.get(typ);

                if (mO.isNothing()) return left(new error.NullPointerErr(data));

                return right(mO.get());

            case DATA_TYPE_LOCAL:

                let mRef = fromNullable(this.locals[value]);

                if (mRef.isNothing()) return nullErr(data);

                //TODO: review call stack safety of this recursive call.
                return this.resolve(mRef.get());

            case DATA_TYPE_MESSAGE:

                if (context.mailbox.length === 0) return nullErr(data);

                //messages are always accessed sequentially FIFO
                return right<Err, PVM_Value>(context.mailbox.shift());

            default:
                return right(value);

        }

    }

    /**
     * pop the top most value from the data stack.
     */
    pop(): Data {

        return <Data>this.data.pop();

    }

    /**
     * popValue pops and attempts to resolve the top most value of the data stack.
     */
    popValue(): Either<Err, PVM_Value> {

        return this.resolve(this.pop());

    }

    /**
     * popString from the top of the data stack.
     */
    popString(): Either<Err, string> {

        return <Either<Err, string>>this.popValue();

    }

    /**
     * popFunction from the top of the data stack.
     */
    popFunction(): Either<Err, PVM_Function> {

        return <Either<Err, PVM_Function>>this.popValue();

    }

    /**
     * popReceiver from the top of the data stack.
     */
    popReceiver(): Either<Err, PVM_Receiver> {

        return <Either<Err, PVM_Receiver>>this.popValue();

    }

    /**
     * popObject from the top of the data stack.
     */
    popObject(): Either<Err, PVM_Object> {

        return <Either<Err, PVM_Object>>this.popValue();

    }

    /**
     * popTemplate from the top of the data stack.
     */
    popTemplate(): Either<Err, PVM_Template> {

        return <Either<Err, PVM_Template>>this.popValue();

    }

    /**
     * popMessage from the top of the data stack.
     */
    popMessage(): Either<Err, PVM_Message> {

        return <Either<Err, PVM_Message>>this.popValue();

    }

    /**
     * duplicate the top of the stack.
     */
    duplicate(): Frame {

        let top = <number>this.data.pop();

        this.data.push(top);
        this.data.push(top);

        return this;

    }

}

const nullErr = (data: Data): Either<Err, PVM_Value> =>
    left(new error.NullPointerErr(data));
