import * as indexes from '../script';
import * as error from '../error';

import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { fromNullable } from '@quenk/noni/lib/data/maybe';
import { Value } from '@quenk/noni/lib/data/json';

import { Address } from '../../../../address';
import { Context } from '../../../../context';
import { Script } from '../script';
import { Instruction, OperandU8, OperandU16 } from '../';

export const DATA_RANGE_TYPE_HIGH = 0x7F000000;
export const DATA_RANGE_TYPE_LOW = 0x1000000;
export const DATA_RANGE_TYPE_STEP = 0x1000000;

export const DATA_RANGE_LOCATION_HIGH = 0xFF0000;
export const DATA_RANGE_LOCATION_LOW = 0x10000;
export const DATA_RANGE_LOCATION_STEP = 0x10000;

export const DATA_RANGE_VALUE_HIGH = 0xFFFF;
export const DATA_RANGE_VALUE_LOW = 0x0;

// Used to extract the desired part via &
export const DATA_MASK_TYPE = 0xFF000000;
export const DATA_MASK_LOCATION = 0xFF0000;
export const DATA_MASK_VALUE8 = 0xFF;
export const DATA_MASK_VALUE16 = 0xFFFF;

export const DATA_MAX_SIZE = 0x7FFFFFFF;

//Type indicators.
export const DATA_TYPE_UINT8 = DATA_RANGE_TYPE_STEP;
export const DATA_TYPE_UINT16 = DATA_RANGE_TYPE_STEP * 2;
export const DATA_TYPE_FLOAT64 = DATA_RANGE_TYPE_STEP * 10;
export const DATA_TYPE_STRING = DATA_RANGE_TYPE_STEP * 15;
export const DATA_TYPE_ADDRESS = DATA_TYPE_STRING;
export const DATA_TYPE_TEMPLATE = DATA_RANGE_TYPE_STEP * 20
export const DATA_TYPE_MESSAGE = DATA_RANGE_TYPE_STEP * 25;

//Storage location indicators.
export const DATA_LOCATION_IMMEDIATE = DATA_RANGE_LOCATION_STEP;
export const DATA_LOCATION_CONSTANTS = DATA_RANGE_LOCATION_STEP * 2;
export const DATA_LOCATION_LOCALS = DATA_RANGE_LOCATION_STEP * 3;
export const DATA_LOCATION_HEAP = DATA_RANGE_LOCATION_STEP * 4;
export const DATA_LOCATION_MAILBOX = DATA_RANGE_LOCATION_STEP * 5;

/**
 * Data is the type of values that can appear on a Frame's data stack.
 *
 * It is a 32bit unsigned integer in the range 0x00000000-0x7FFFFFFF
 *
 * The highest byte is used to indicate the type of the data, the next byte,
 * it's location and the remaining bytes store  value.
 *
 * 11111111 11111111    11111111 11111111
 *  <type>  <location>  <     value      >
 * The way the value is calculated depends on the type.
 */
export type Data = number;

/**
 * DataType enum.
 */
export enum DataType {

    UInt8 = DATA_TYPE_UINT8,

    UInt16 = DATA_TYPE_UINT16,

    Float64 = DATA_TYPE_FLOAT64,

    String = DATA_TYPE_STRING,

    Address = DATA_TYPE_ADDRESS,

    Template = DATA_TYPE_TEMPLATE,

    Message = DATA_TYPE_MESSAGE,

}

/**
 * Location enum.
 */
export enum Location {

    Immediate = DATA_LOCATION_IMMEDIATE,

    Constants = DATA_LOCATION_CONSTANTS,

    Heap = DATA_LOCATION_HEAP,

    Local = DATA_LOCATION_LOCALS,

    Mailbox = DATA_LOCATION_MAILBOX

}

/**
 * typeMaps maps a type to its index in the contants pool.
 */
export const typeMaps: { [key: number]: number } = {

    [DATA_TYPE_FLOAT64]: indexes.PVM_TYPE_INDEX_FLOAT64,

    [DATA_TYPE_STRING]: indexes.PVM_TYPE_INDEX_STRING,

    [DATA_TYPE_ADDRESS]: indexes.PVM_TYPE_INDEX_ADDRESS,

    [DATA_TYPE_TEMPLATE]: indexes.PVM_TYPE_INDEX_TEMPLATE,

    [DATA_TYPE_MESSAGE]: indexes.PVM_TYPE_INDEX_MESSAGE

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
    push(value: Data): Frame {

        this.data.push(value);
        return this;

    }

    /**
     * pushUInt8 pushes an unsigned 8bit integer onto the data stack.
     */
    pushUInt8(value: OperandU8): Frame {

        this.push(
            value &
            DATA_MASK_VALUE8 |
            DATA_LOCATION_IMMEDIATE |
            DATA_TYPE_UINT8);

        return this;

    }

    /**
     * pushUInt16 pushes an unsigned 16bit integer onto the data stack.
     */
    pushUInt16(value: OperandU16): Frame {

        this.push(
            value &
            DATA_MASK_VALUE8 |
            DATA_LOCATION_IMMEDIATE |
            DATA_TYPE_UINT16);

        return this;

    }

    /**
     * pushAddress onto the stack.
     *
     * The actual address is stored on the heap.
    pushAddress(value: Address): Frame {

        let idx = this.heap.indexOf(value);

        idx = (idx === -1) ? this.heap.push(value) - 1 : idx;

        this.push(idx &
            DATA_MASK_VALUE16 |
            DATA_LOCATION_HEAP |
            DATA_TYPE_ADDRESS);

        return this;

    }
    */

    /**
     * resolve a value from it's location, producing 
     * an error if it can not be found.
     */
    resolve(data: Data): Either<Err, Value> {

        let { script, context } = this;

        let typ = data & DATA_MASK_TYPE;
        let location = data & DATA_MASK_LOCATION;
        let value = data & DATA_MASK_VALUE16;

        switch (location) {

            case DATA_LOCATION_IMMEDIATE:
                return right(value);
                break;

            case DATA_LOCATION_CONSTANTS:

                let mTypes = fromNullable(script.constants[typeMaps[typ]]);

                if (mTypes.isNothing()) return nullErr(data);

                let types = mTypes.get();

                let mVal = fromNullable(types[value]);

                if (mVal.isNothing()) return nullErr(data);

                return right<Err, Value>(mVal.get());

                break;

            case DATA_LOCATION_LOCALS:

                let mRef = fromNullable(this.locals[value]);

                if (mRef.isNothing()) return nullErr(data);

                //TODO: review call stack safety of this recursive call.
                return this.resolve(mRef.get());

                break;

            case Location.Mailbox:

                if (context.mailbox.isNothing()) return nullErr(data);

                let mailbox = context.mailbox.get();

                let mMsg = fromNullable(mailbox[value]);

                if (mMsg.isNothing()) return nullErr(data);

                return right<Err, Value>(mMsg.get());

                break;

            default:
                return nullErr(data);

        }

    }

}

const nullErr = (data: Data): Either<Err, Value> =>
    left(new error.NullPointerErr(data));
