import { Either } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Address } from '../../../../address';
import { Context } from '../../../../context';
import { Template } from '../../template';
import { Script, PVM_Value } from '../../script';
import { Instruction, OperandU8, OperandU16, Operand } from '../';
export declare const DATA_RANGE_TYPE_HIGH = 2130706432;
export declare const DATA_RANGE_TYPE_LOW = 16777216;
export declare const DATA_RANGE_TYPE_STEP = 16777216;
export declare const DATA_RANGE_LOCATION_HIGH = 16711680;
export declare const DATA_RANGE_LOCATION_LOW = 65536;
export declare const DATA_RANGE_LOCATION_STEP = 65536;
export declare const DATA_RANGE_VALUE_HIGH = 65535;
export declare const DATA_RANGE_VALUE_LOW = 0;
export declare const DATA_MASK_TYPE = 4278190080;
export declare const DATA_MASK_LOCATION = 16711680;
export declare const DATA_MASK_VALUE8 = 255;
export declare const DATA_MASK_VALUE16 = 65535;
export declare const DATA_MAX_SIZE = 2147483647;
export declare const DATA_TYPE_UINT8 = 16777216;
export declare const DATA_TYPE_UINT16: number;
export declare const DATA_TYPE_FLOAT64: number;
export declare const DATA_TYPE_STRING: number;
export declare const DATA_TYPE_ADDRESS: number;
export declare const DATA_TYPE_TEMPLATE: number;
export declare const DATA_TYPE_MESSAGE: number;
export declare const DATA_LOCATION_IMMEDIATE = 65536;
export declare const DATA_LOCATION_CONSTANTS: number;
export declare const DATA_LOCATION_LOCALS: number;
export declare const DATA_LOCATION_HEAP: number;
export declare const DATA_LOCATION_MAILBOX: number;
/**
 * Data is the type of values that can appear on a Frame's data stack.
 *
 * It is a 32bit unsigned integer in the range 0x00000000-0x7FFFFFFF
 *
 * The highest byte is used to indicate the type of the data, the next byte,
 * it's location and the remaining bytes store  value.
 *
 * 11111111 11111111  11111111 11111111
 * <type>  <location> <     value      >
 * The way the value is calculated depends on the type.
 */
export declare type Data = number;
/**
 * DataType enum.
 */
export declare enum DataType {
    UInt8,
    UInt16,
    Float64,
    String,
    Address,
    Template,
    Message
}
/**
 * Location enum.
 */
export declare enum Location {
    Immediate,
    Constants,
    Heap,
    Local,
    Mailbox
}
/**
 * typeMaps maps a type to its index in the contants pool.
 */
export declare const typeMaps: {
    [key: number]: number;
};
/**
 * Frame is the context for currently executing op codes.
 *
 * It provides methods for manipulating the stack common to each op code as
 * well as access to other components of the system.
 */
export declare class Frame {
    actor: Address;
    context: Context;
    script: Script;
    code: Instruction[];
    data: Data[];
    locals: Data[];
    ip: number;
    constructor(actor: Address, context: Context, script: Script, code?: Instruction[], data?: Data[], locals?: Data[], ip?: number);
    /**
     * push a value onto the data stack.
     *
     * Care should be taken when using this method to ensure the value has
     * the correct bits set.
     */
    push(d: Data): Frame;
    /**
     * pushUInt8 pushes an unsigned 8bit integer onto the data stack.
     */
    pushUInt8(value: OperandU8): Frame;
    /**
     * pushUInt16 pushes an unsigned 16bit integer onto the data stack.
     */
    pushUInt16(value: OperandU16): Frame;
    /**
     * pushString from the constant pool onto the data stack.
     */
    pushString(idx: Operand): Frame;
    /**
     * pushTemplate from the constant pool onto the data stack.
     */
    pushTemplate(idx: Operand): Frame;
    /**
     * resolve a value from it's location, producing
     * an error if it can not be found.
     */
    resolve(data: Data): Either<Err, PVM_Value>;
    /**
     * pop the top most value from the data stack.
     */
    pop(): Data;
    /**
     * popValue pops and attempts to resolve the top most value of the data stack.
     */
    popValue(): Either<Err, PVM_Value>;
    /**
     *  popString from the top of the data stack.
     */
    popString(): Either<Err, string>;
    /**
     * popTemplate from the top of the data stack.
     */
    popTemplate(): Either<Err, Template>;
}
