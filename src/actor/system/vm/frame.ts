import * as indexes from './script';
import * as error from './runtime/error';

import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Type } from '@quenk/noni/lib/data/type';
import { Maybe, fromNullable, nothing } from '@quenk/noni/lib/data/maybe';

import { FunInfo, Info } from './script/info';
import { JSThread } from './thread/shared/js';
import { Script } from './script';
import { PTObject } from './object';
import { Instruction, Operand } from './op';
import { PTValue, BYTE_TYPE, TYPE_FUN } from './type';

export const DATA_RANGE_TYPE_HIGH = 0xf0000000;
export const DATA_RANGE_TYPE_LOW = 0x1000000;
export const DATA_RANGE_TYPE_STEP = 0x1000000;

// Used to extract the desired part via &
export const DATA_MASK_TYPE = 0xff000000;
export const DATA_MASK_VALUE8 = 0xff;
export const DATA_MASK_VALUE16 = 0xffff;
export const DATA_MASK_VALUE24 = 0xffffff;
export const DATA_MASK_VALUE32 = 0xffffffff;

export const DATA_MAX_SIZE = 0xffffffff;
export const DATA_MAX_SAFE_UINT32 = 0x7fffffff;

//These really indicate where the actual value of an operand is stored.
//They are not meant to be used to check the actual type of the underlying value.
export const DATA_TYPE_STRING = DATA_RANGE_TYPE_STEP * 3;
export const DATA_TYPE_INFO = DATA_RANGE_TYPE_STEP * 4;
export const DATA_TYPE_HEAP_STRING = DATA_RANGE_TYPE_STEP * 6;
export const DATA_TYPE_HEAP_OBJECT = DATA_RANGE_TYPE_STEP * 7;
export const DATA_TYPE_HEAP_FOREIGN = DATA_RANGE_TYPE_STEP * 8;
export const DATA_TYPE_HEAP_FUN = DATA_RANGE_TYPE_STEP * 9;
export const DATA_TYPE_LOCAL = DATA_RANGE_TYPE_STEP * 10;
export const DATA_TYPE_MAILBOX = DATA_RANGE_TYPE_STEP * 11;
export const DATA_TYPE_SELF = DATA_RANGE_TYPE_STEP * 12;
export const DATA_TYPE_VOID = DATA_RANGE_TYPE_STEP * 13;

export const BYTE_CONSTANT_NUM = 0x10000;
export const BYTE_CONSTANT_STR = 0x20000;
export const BYTE_CONSTANT_INFO = 0x30000;

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
export type Data = number;

/**
 * Used to identity frames via a specific format:
 * <templateid>@<actorid>#<callstack>
 *
 * Where <callstack> is a list of function names in the callstack up to the
 * Frame's own function separated by '/'.
 */
export type FrameName = string;

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
    thread: JSThread;

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
export class StackFrame implements Frame {
    constructor(
        public name: string,
        public script: Script,
        public thread: JSThread,
        public parent: Maybe<Frame> = nothing(),
        public code: Instruction[] = [],
        public data: Data[] = [],
        public locals: Data[] = [],
        public ip = 0
    ) {}

    getPosition(): number {
        return this.ip;
    }

    push(d: Data): Frame {
        this.data.push(d);
        return this;
    }

    pushUInt8(value: Operand): Frame {
        return this.push((value >>> 0) & DATA_MASK_VALUE8);
    }

    pushUInt16(value: Operand): Frame {
        return this.push((value >>> 0) & DATA_MASK_VALUE16);
    }

    pushUInt32(value: Operand): Frame {
        return this.push(value >>> 0);
    }

    pushString(idx: Operand): Frame {
        return this.push(idx | DATA_TYPE_STRING);
    }

    pushName(idx: Operand): Frame {
        return this.push(idx | DATA_TYPE_INFO);
    }

    pushMessage(): Frame {
        return this.push(0 | DATA_TYPE_MAILBOX);
    }

    pushSelf(): Frame {
        return this.push(DATA_TYPE_SELF);
    }

    peek(n = 0): Maybe<Data> {
        return fromNullable(this.data.length - (n + 1));
    }

    resolve(data: Data): Either<Err, Type> {
        let typ = data & DATA_MASK_TYPE;

        let value = data & DATA_MASK_VALUE24;

        switch (typ) {
            case DATA_TYPE_STRING:
            case DATA_TYPE_HEAP_STRING:
                this.push(data);
                return this.popString();

            case DATA_TYPE_HEAP_FUN:
                this.push(data);
                return this.popFunction();

            case DATA_TYPE_HEAP_OBJECT:
                this.push(data);
                return this.popObject();

            case DATA_TYPE_HEAP_FOREIGN:
                this.push(data);
                return this.popForeign();

            case DATA_TYPE_INFO:
                this.push(data);
                return this.popName();

            //TODO: This is probably not needed.
            case DATA_TYPE_LOCAL:
                let mRef = fromNullable(this.locals[value]);

                if (mRef.isNothing()) return nullErr(data);

                //TODO: review call stack safety of this recursive call.
                return this.resolve(mRef.get());

            case DATA_TYPE_MAILBOX:
                if (this.thread.mailbox.length === 0) return nullErr(data);

                //messages are always accessed sequentially FIFO
                return right<Err, PTValue>(this.thread.mailbox.shift());

            case DATA_TYPE_SELF:
                return right<Err, PTValue>(this.thread.address);

            //TODO: This sometimes results in us treating 0 as a legitimate
            //value whereas it should be an error. However, 0 is a valid value
            //for numbers, and booleans. Needs review, solution may be in ops
            //rather than here.
            default:
                return right(value);
        }
    }

    pop(): Data {
        return (<Data>this.data.pop()) | 0;
    }

    popValue(): Either<Err, PTValue> {
        return this.data.length === 0
            ? left(new error.StackEmptyErr())
            : this.resolve(this.pop());
    }

    popString(): Either<Err, string> {
        let data = this.pop();
        let typ = data & DATA_MASK_TYPE;
        let idx = data & DATA_MASK_VALUE24;

        if (typ === DATA_TYPE_STRING) {
            let s = this.script.constants[indexes.CONSTANTS_INDEX_STRING][idx];

            if (s == null) return missingSymbol(data);

            return right(s);
        } else if (typ === DATA_TYPE_HEAP_STRING) {
            return right(this.thread.vm.registry.getString(data).get());
        } else if (typ === DATA_TYPE_SELF) {
            return right(this.thread.address);
        } else {
            return wrongType(DATA_TYPE_STRING, typ);
        }
    }

    popName(): Either<Err, Info> {
        let data = this.pop();
        let typ = data & DATA_MASK_TYPE;
        let idx = data & DATA_MASK_VALUE24;

        if (typ === DATA_TYPE_INFO) {
            let info = this.script.info[idx];

            if (info == null) return nullErr(data);

            return right(info);
        } else {
            return wrongType(DATA_TYPE_INFO, data);
        }
    }

    popFunction(): Either<Err, FunInfo> {
        let data = this.pop();

        /* TODO: Heap functions are no longer supported right now.
        let typ = data & DATA_MASK_TYPE;
        if (typ === DATA_TYPE_HEAP_FUN) {
            let mFun = this.thread.vm.heap.getObject(data);

            return mFun.isJust() ? right(mFun.get()) : nullFunPtr(data);
        } else {
        */
        this.push(data);

        return <Either<Err, FunInfo>>this.popName().chain(nfo => {
            if (((<FunInfo>nfo).descriptor & BYTE_TYPE) !== TYPE_FUN)
                return notAFunction(nfo.name);

            return right(nfo);
        });
    }

    popObject(): Either<Err, PTObject> {
        let data = this.pop();
        let typ = data & DATA_MASK_TYPE;

        if (typ === DATA_TYPE_HEAP_OBJECT) {
            let mho = this.thread.vm.registry.getObject(data);

            if (mho.isNothing()) return nullErr(data);

            // TODO: review how this works.
            return <any>right(mho.get());
        } else {
            return wrongType(DATA_TYPE_HEAP_OBJECT, typ);
        }
    }

    popForeign(): Either<Err, Type> {
        let data = this.pop();
        let typ = data & DATA_MASK_TYPE;

        if (typ === DATA_TYPE_HEAP_FOREIGN) {
            let mho = this.thread.vm.registry.getObject(data);

            if (mho.isNothing()) return nullErr(data);

            return right(mho.get());
        } else {
            return wrongType(DATA_TYPE_HEAP_FOREIGN, typ);
        }
    }

    duplicate(): Frame {
        let top = <number>this.data.pop();

        this.data.push(top);
        this.data.push(top);

        return this;
    }

    advance(): Frame {
        this.ip = this.ip + 1;

        return this;
    }

    seek(loc: number): Frame {
        this.ip = loc;

        return this;
    }

    isFinished(): boolean {
        return this.ip >= this.code.length;
    }
}

const nullErr = <T>(data: Data): Either<Err, T> =>
    left(new error.NullPointerErr(data));

const wrongType = <T>(expect: number, got: number): Either<Err, T> =>
    left(new error.UnexpectedDataType(expect, got));

const notAFunction = <T>(name: string): Either<Err, T> =>
    left(new error.InvalidFunctionErr(name));

//const nullFunPtr = <T>(addr: Data): Either<Err, T> =>
//    left(new error.NullFunctionPointerErr(addr));

const missingSymbol = <T>(data: Data): Either<Err, T> =>
    left(new error.MissingSymbolErr(data));
