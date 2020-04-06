import * as indexes from '../../script';
import * as error from '../error';

import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { fromNullable, Maybe } from '@quenk/noni/lib/data/maybe';
import { tail } from '@quenk/noni/lib/data/array';

import { Context } from '../context';
import {
    Script,
    PVM_Value,
    PVM_Template,
    PVM_Object,
    PVM_Function,
} from '../../script';
import { Instruction, OperandU8, OperandU16, Operand } from '../';
import { Heap } from '../heap';
import { ConstructorInfo, INFO_TYPE_CONSTRUCTOR } from '../../script/info';

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
export const DATA_TYPE_SYMBOL = DATA_RANGE_TYPE_STEP * 4;
export const DATA_TYPE_HEAP = DATA_RANGE_TYPE_STEP * 6;
export const DATA_TYPE_LOCAL = DATA_RANGE_TYPE_STEP * 7;
export const DATA_TYPE_MAILBOX = DATA_RANGE_TYPE_STEP * 8;
export const DATA_TYPE_SELF = DATA_RANGE_TYPE_STEP * 9;

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
export type Data = number;

/**
 * Frame is the context for currently executing op codes.
 *
 * It provides methods for manipulating the stack common to each op code as 
 * well as access to other components of the system.
 */
export interface Frame {

    /**
     * name of the routine this frame belongs too.
     */
    name: string;

    /**
     * script the routine is defined in.
     */
    script: Script;

    /**
     * context of the actor that is executing this frame.
     */
    context: Context;

    /**
     * heap of the current Runtime
     */
    heap: Heap;

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
     * ip is a pointer to the code instruction currently being executed.
     */
    ip: number;

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
     * pushMessage from the mailbox onto the stack.
     */
    pushMessage(): Frame;

    /**
     * pushSelf pushes the address of the executing actor on to the stack.
     */
    pushSelf(): Frame;

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
     * Do not use this method to retreive uint8,uint16 or uint32.
     */
    resolve(data: Data): Either<Err, PVM_Value>;

    /**
     * pop the top most value from the data stack.
     *
     * If the stack is empty the value 0 is returned.
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

/**
 * StackFrame (Frame implementation).
 */
export class StackFrame implements Frame {

    constructor(
        public name: string,
        public script: Script,
        public context: Context,
        public heap: Heap,
        public code: Instruction[] = [],
        public data: Data[] = [],
        public locals: Data[] = [],
        public ip = 0) { }

    push(d: Data): Frame {

        this.data.push(d);
        return this;

    }

    pushUInt8(value: OperandU8): Frame {

        return this.push((value >>> 0) & DATA_MASK_VALUE8);

    }

    pushUInt16(value: OperandU16): Frame {

        return this.push((value >>> 0) & DATA_MASK_VALUE16);

    }

    pushUInt32(value: Operand): Frame {

        return this.push(value >>> 0);

    }

    pushString(idx: Operand): Frame {

        return this.push(idx | DATA_TYPE_STRING);

    }

    pushSymbol(idx: OperandU16): Frame {

        return this.push(idx | DATA_TYPE_SYMBOL);

    }

    pushMessage(): Frame {

        return this.push(0 | DATA_TYPE_MAILBOX);

    }

    pushSelf(): Frame {

        return this.push(DATA_TYPE_SELF);

    }

    peek(): Maybe<Data> {

        //TODO: Return 0 instead of Maybe?
        return fromNullable(tail(this.data));

    }

    peekConstructor(): Either<Err, ConstructorInfo> {

        let mword = this.peek();

        if (mword.isNothing()) return left(new error.NullPointerErr(0));

        let word = DATA_MASK_VALUE24 & mword.get();

        let info = this.script.info[DATA_MASK_VALUE24 & word];

        if ((info == null) || (info.infoType !== INFO_TYPE_CONSTRUCTOR))
            return left(new error.NullPointerErr(word));

        return right(<ConstructorInfo>info);

    }

    resolve(data: Data): Either<Err, PVM_Value> {

        let { script, context } = this;

        let typ = data & DATA_MASK_TYPE;

        let value = data & DATA_MASK_VALUE24;

        switch (typ) {

            case DATA_TYPE_STRING:

                let mstr = fromNullable(
                    script.constants[indexes.CONSTANTS_INDEX_STRING][value]);

                return right(mstr.get());

            case DATA_TYPE_SYMBOL:

                let info = this.script.info[value];

                if (info == null)
                    return left(new error.MissingSymbolErr(value));

                return right(info);

            case DATA_TYPE_HEAP:

                let mO = this.heap.get(typ);

                if (mO.isNothing()) return left(new error.NullPointerErr(data));

                return right(mO.get().value);

            //TODO: This is probably not needed.
            case DATA_TYPE_LOCAL:

                let mRef = fromNullable(this.locals[value]);

                if (mRef.isNothing()) return nullErr(data);

                //TODO: review call stack safety of this recursive call.
                return this.resolve(mRef.get());

            case DATA_TYPE_MAILBOX:

                if (context.mailbox.length === 0) return nullErr(data);

                //messages are always accessed sequentially FIFO
                return right<Err, PVM_Value>(context.mailbox.shift());

            case DATA_TYPE_SELF:
                return right<Err, PVM_Value>(context.address);

            default:
                return right(value);

        }

    }

    pop(): Data {

        return (<Data>this.data.pop() | 0);

    }

    popValue(): Either<Err, PVM_Value> {

        return this.resolve(this.pop());

    }

    popString(): Either<Err, string> {

        return <Either<Err, string>>this.popValue();

    }

    popFunction(): Either<Err, PVM_Function> {

        return <Either<Err, PVM_Function>>this.popValue();

    }

    popObject(): Either<Err, PVM_Object> {

        return <Either<Err, PVM_Object>>this.popValue();

    }

    popTemplate(): Either<Err, PVM_Template> {

        return <Either<Err, PVM_Template>>this.popValue();

    }

    duplicate(): Frame {

        let top = <number>this.data.pop();

        this.data.push(top);
        this.data.push(top);

        return this;

    }

}

const nullErr = (data: Data): Either<Err, PVM_Value> =>
    left(new error.NullPointerErr(data));
