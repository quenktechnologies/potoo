import { Either } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Context } from '../../../../context';
import { Script, PVM_Value, PVM_Template, PVM_Object, PVM_Function } from '../../script';
import { Instruction, OperandU8, OperandU16, Operand } from '../';
import { Heap } from '../heap';
import { ConstructorInfo } from '../../script/info';
export declare const DATA_RANGE_TYPE_HIGH = 2130706432;
export declare const DATA_RANGE_TYPE_LOW = 16777216;
export declare const DATA_RANGE_TYPE_STEP = 16777216;
export declare const DATA_MASK_TYPE = 4278190080;
export declare const DATA_MASK_VALUE8 = 255;
export declare const DATA_MASK_VALUE16 = 65535;
export declare const DATA_MASK_VALUE24 = 16777215;
export declare const DATA_MASK_VALUE32 = 4294967295;
export declare const DATA_MAX_SIZE = 2147483647;
export declare const DATA_MAX_SAFE_UINT32 = 2147483647;
export declare const DATA_TYPE_UINT8 = 16777216;
export declare const DATA_TYPE_UINT16: number;
export declare const DATA_TYPE_STRING: number;
export declare const DATA_TYPE_SYMBOL: number;
export declare const DATA_TYPE_HEAP: number;
export declare const DATA_TYPE_LOCAL: number;
export declare const DATA_TYPE_MAILBOX: number;
/**
 * Data is the type of values that can appear on a Frame's data stack.
 *
 * It is a 32bit unsigned integer in the range 0x00000000-0x7FFFFFFF
 *
 * Typically, the highest byte is used to indicate the type of the data
 * in realtion to storage location and the remaining 3 bytes, value.
 *
 * 11111111        111111111111111111111111
 * <type/location> <     value      >
 *
 * The actual interpretation of the location and value part are dependant on
 * the type.
 */
export declare type Data = number;
/**
 * Frame is the context for currently executing op codes.
 *
 * It provides methods for manipulating the stack common to each op code as
 * well as access to other components of the system.
 */
export declare class Frame {
    name: string;
    script: Script;
    context: Context;
    heap: Heap;
    code: Instruction[];
    data: Data[];
    rdata: Data[];
    locals: Data[];
    ip: number;
    constructor(name: string, script: Script, context: Context, heap: Heap, code?: Instruction[], data?: Data[], rdata?: Data[], locals?: Data[], ip?: number);
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
     * pushUInt32 pushes an unsigned 32bit integer onto the data stack.
     */
    pushUInt32(value: Operand): Frame;
    /**
     * pushString from the constant pool onto the data stack.
     */
    pushString(idx: Operand): Frame;
    /**
     * pushSymbol pushes a symbol from the info table at idx onto the stack.
     */
    pushSymbol(idx: OperandU16): Frame;
    /**
     * pushMessage from the receivers section onto the stack.
     */
    pushMessage(): Frame;
    /**
     * peek at the top of the data stack.
     */
    peek(): Maybe<Data>;
    /**
     * peekConstructor peeks and resolves the constructor for the object
     * reference at the top of the stack.
     */
    peekConstructor(): Either<Err, ConstructorInfo>;
    /**
     * resolve a value from its reference.
     *
     * An error will be produced if the value cannot be resolved.
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
     * popString from the top of the data stack.
     */
    popString(): Either<Err, string>;
    /**
     * popFunction from the top of the data stack.
     */
    popFunction(): Either<Err, PVM_Function>;
    /**
     * popObject from the top of the data stack.
     */
    popObject(): Either<Err, PVM_Object>;
    /**
     * popTemplate from the top of the data stack.
     */
    popTemplate(): Either<Err, PVM_Template>;
    /**
     * duplicate the top of the stack.
     */
    duplicate(): Frame;
}
