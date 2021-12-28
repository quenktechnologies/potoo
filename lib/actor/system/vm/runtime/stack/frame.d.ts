import { Either } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Type } from '@quenk/noni/lib/data/type';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Script } from '../../script';
import { PTObject } from '../../type';
import { PTValue } from '../../type';
import { FunInfo, Info } from '../../script/info';
import { VMThread } from '../../thread';
import { Instruction, Operand } from '../';
export declare const DATA_RANGE_TYPE_HIGH = 4026531840;
export declare const DATA_RANGE_TYPE_LOW = 16777216;
export declare const DATA_RANGE_TYPE_STEP = 16777216;
export declare const DATA_MASK_TYPE = 4278190080;
export declare const DATA_MASK_VALUE8 = 255;
export declare const DATA_MASK_VALUE16 = 65535;
export declare const DATA_MASK_VALUE24 = 16777215;
export declare const DATA_MASK_VALUE32 = 4294967295;
export declare const DATA_MAX_SIZE = 4294967295;
export declare const DATA_MAX_SAFE_UINT32 = 2147483647;
export declare const DATA_TYPE_STRING: number;
export declare const DATA_TYPE_INFO: number;
export declare const DATA_TYPE_HEAP_STRING: number;
export declare const DATA_TYPE_HEAP_OBJECT: number;
export declare const DATA_TYPE_HEAP_FOREIGN: number;
export declare const DATA_TYPE_HEAP_FUN: number;
export declare const DATA_TYPE_LOCAL: number;
export declare const DATA_TYPE_MAILBOX: number;
export declare const DATA_TYPE_SELF: number;
export declare const BYTE_CONSTANT_NUM = 65536;
export declare const BYTE_CONSTANT_STR = 131072;
export declare const BYTE_CONSTANT_INFO = 196608;
/**
 * Data is the type of values that can appear on a Frame's data stack.
 *
 * It is a 32bit unsigned integer in the range 0x00000000-0x7FFFFFFF
 *
 * Typically, the highest byte is used to indicate the type of the data
 * in realtion to storage location and the remaining 3 bytes, value.
 *
 * 11111111            11111111 11111111 11111111
 * <type/location>      <     value      >
 *
 * The actual interpretation of the location and value part are dependant on
 * the type.
 */
export declare type Data = number;
/**
 * Used to identity frames via a specific format:
 * <templateid>@<actorid>#<callstack>
 *
 * Where <callstack> is a list of function names in the callstack up to the
 * Frame's own function separated by '/'.
 */
export declare type FrameName = string;
/**
 * Frame is the context for currently executing op codes.
 *
 * It provides methods for manipulating the stack common to each op code as
 * well as access to other components of the system.
 */
export interface Frame {
    /**
     * name of the Frame used to identity it.
     */
    name: FrameName;
    /**
     * script the routine is defined in.
     */
    script: Script;
    /**
     * thread for the actor.
     */
    thread: VMThread;
    /**
     * parent Frame that created this Frame (if any).
     */
    parent: Maybe<Frame>;
    /**
     * code the frame executes as part of the routine.
     */
    code: Instruction[];
    /**
     * data stack or operand stack.
     */
    data: Data[];
    /**
     * locals contains variables local to the routine.
     */
    locals: Data[];
    /**
     * getPosition of the internal instruction pointer.
     */
    getPosition(): number;
    /**
     * push an operand onto the data stack.
     *
     * Values not in the range 0 - 2^32 (integer only) may yield unexpected
     * results during computation. Care should be taken when using this method
     * directly to ensure the desired value is actual on the stack.
     */
    push(d: Data): Frame;
    /**
     * pushUInt8 pushes an unsigned 8bit integer onto the data stack.
     */
    pushUInt8(value: Operand): Frame;
    /**
     * pushUInt16 pushes an unsigned 16bit integer onto the data stack.
     */
    pushUInt16(value: Operand): Frame;
    /**
     * pushUInt32 pushes an unsigned 32bit integer onto the data stack.
     */
    pushUInt32(value: Operand): Frame;
    /**
     * pushString from the constant pool onto the data stack.
     */
    pushString(idx: Operand): Frame;
    /**
     * pushName pushes a named constant from the info section onto the stack.
     */
    pushName(idx: Operand): Frame;
    /**
     * pushMessage from the mailbox onto the stack.
     */
    pushMessage(): Frame;
    /**
     * pushSelf pushes the address of the executing actor on to the stack.
     */
    pushSelf(): Frame;
    /**
     * peek at the top of the data stack.
     *
     * An offset can be specified to peek further down the stack.
     */
    peek(n?: number): Maybe<Data>;
    /**
     * resolve a value from its reference.
     *
     * An error will be produced if the value cannot be resolved.
     * Do not use this method to retreive uint8,uint16 or uint32.
     */
    resolve(data: Data): Either<Err, PTValue>;
    /**
     * pop the top most value from the data stack.
     *
     * If the stack is empty the value 0 is returned.
     */
    pop(): Data;
    /**
     * popValue pops and attempts to resolve the top most value of the data stack.
     */
    popValue(): Either<Err, Type>;
    /**
     * popString from the top of the data stack.
     */
    popString(): Either<Err, string>;
    /**
     * popName pops a named object from the top of the data stack.
     */
    popName(): Either<Err, Info>;
    /**
     * popFunction from the top of the data stack.
     */
    popFunction(): Either<Err, FunInfo>;
    /**
     * popObject provides the entry for an object in the heap.
     */
    popObject(): Either<Err, PTObject>;
    /**
     * popForeign provides the entry for a foreign object in the heap.
     */
    popForeign(): Either<Err, Type>;
    /**
     * duplicate the top of the stack.
     */
    duplicate(): Frame;
    /**
     * advance the internal instruction pointer by 1 place.
     */
    advance(): Frame;
    /**
     * seek advances the instruction pointer to the specified location.
     */
    seek(loc: number): Frame;
    /**
     * isFinished returns true if the instruction pointer for the frame has
     * reached the end of the code section.
     */
    isFinished(): boolean;
}
/**
 * StackFrame (Frame implementation).
 */
export declare class StackFrame implements Frame {
    name: string;
    script: Script;
    thread: VMThread;
    parent: Maybe<Frame>;
    code: Instruction[];
    data: Data[];
    locals: Data[];
    ip: number;
    constructor(name: string, script: Script, thread: VMThread, parent?: Maybe<Frame>, code?: Instruction[], data?: Data[], locals?: Data[], ip?: number);
    getPosition(): number;
    push(d: Data): Frame;
    pushUInt8(value: Operand): Frame;
    pushUInt16(value: Operand): Frame;
    pushUInt32(value: Operand): Frame;
    pushString(idx: Operand): Frame;
    pushName(idx: Operand): Frame;
    pushMessage(): Frame;
    pushSelf(): Frame;
    peek(n?: number): Maybe<Data>;
    resolve(data: Data): Either<Err, Type>;
    pop(): Data;
    popValue(): Either<Err, PTValue>;
    popString(): Either<Err, string>;
    popName(): Either<Err, Info>;
    popFunction(): Either<Err, FunInfo>;
    popObject(): Either<Err, PTObject>;
    popForeign(): Either<Err, Type>;
    duplicate(): Frame;
    advance(): Frame;
    seek(loc: number): Frame;
    isFinished(): boolean;
}
