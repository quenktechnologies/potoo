import * as error from '../runtime/error';

import { JSThread } from '../thread/shared/js';
import { Frame, DATA_MAX_SAFE_UINT32 } from '../frame';
import { Operand } from '.';

/**
 * nop does nothing.
 *
 * Stack:
 *  ->
 */
export const nop = (_: JSThread, __: Frame, ___: Operand) => {};

/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 *
 * Stack:
 * -> <uint8>
 */
export const pushui8 = (_: JSThread, f: Frame, oper: Operand) => {
    f.pushUInt8(oper);
};

/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 *
 * Stack:
 *  -> <uint16>
 */
export const pushui16 = (_: JSThread, f: Frame, oper: Operand) => {
    f.pushUInt16(oper);
};

/**
 * pushui32 pushes an unsigned 32bit integer onto the stack.
 *
 * NOTE: In a future revision, the operand may be treated as an index.
 * Stack:
 *  -> <uint32>
 */
export const pushui32 = (_: JSThread, f: Frame, oper: Operand) => {
    f.pushUInt32(oper);
};

/**
 * lds loads a string from the constant pool onto the stack.
 *
 * Stack:
 *  -> <string>
 */
export const lds = (_: JSThread, f: Frame, idx: Operand) => {
    f.pushString(idx);
};

/**
 * ldn loads an info object from the compiled script.
 *
 * -> <value>
 */
export const ldn = (_: JSThread, f: Frame, idx: Operand) => {
    f.pushName(idx);
};

/**
 * dup duplicates the value on top of the data stack.
 *
 * Stack:
 * <any> -> <any>,<any>
 */
export const dup = (_: JSThread, f: Frame, __: Operand) => {
    f.duplicate();
};

/**
 * store the value at the top of the data stack in the variable indicated
 * by idx.
 *
 * Stack:
 * <any> ->
 */
export const store = (_: JSThread, f: Frame, idx: Operand) => {
    f.locals[idx] = f.pop();
};

/**
 * load the value stored at idx in the variables array onto the top of the
 * stack.
 *
 * If the variable is undefined 0 is placed on the stack.
 *
 * Stack:
 *  -> <any>
 */
export const load = (_: JSThread, f: Frame, idx: Operand) => {
    let d = f.locals[idx];

    f.push(d == null ? 0 : d);
};

/**
 * ceq compares two values for equality.
 *
 * Pushes 1 if true, 0 otherwise.
 *
 * Stack:
 *
 * <val1>,<val2> -> <unint32>
 */
export const ceq = (r: JSThread, f: Frame, __: Operand) => {
    //TODO: Should null == null or raise an error?

    let eLhs = f.popValue();

    let eRhs = f.popValue();

    if (eLhs.isLeft()) return r.raise(eLhs.takeLeft());

    if (eRhs.isLeft()) return r.raise(eRhs.takeLeft());

    if (eLhs.takeRight() === eRhs.takeRight()) f.push(1);
    else f.push(0);
};

/**
 * addui32 treats the top two operands on the data stack as uint32s and adds
 * them.
 *
 * The result is a 32 bit value. If the result is more than MAX_SAFE_INTEGER an
 * IntergerOverflowErr will be raised.
 */
export const addui32 = (r: JSThread, f: Frame, _: Operand) => {
    let val = f.pop() + f.pop();

    if (val > DATA_MAX_SAFE_UINT32)
        return r.raise(new error.IntegerOverflowErr());

    f.push(val);
};

/**
 * call a function placing its result on the heap.
 *
 * Stack:
 *
 * <arg>...? -> <result>
 */
export const call = (r: JSThread, f: Frame, _: Operand) => {
    let einfo = f.popFunction();

    if (einfo.isLeft()) return r.raise(einfo.takeLeft());

    let fn = einfo.takeRight();

    if (fn.foreign === true) {
        //TODO: This is unsafe but the extent of its effect on overall stability
        // should be compared to the time taken to ensure each value.
        //    let args = make(fn.argc || 0, () => f.popValue().takeRight());
        //       r.invokeForeign(f, <ForeignFunInfo>fn, args);
    } else {
        //      r.invokeVM(f, fn);
    }
};

/**
 * raise an exception.
 *
 * Stack:
 *
 * <message> ->
 */
export const raise = (r: JSThread, f: Frame, _: Operand) => {
    let emsg = f.popString();

    r.raise(new Error(emsg.takeRight()));
};

/**
 * jmp jumps to the instruction at the specified address.
 *
 * Stack:
 *  ->
 */
export const jmp = (_: JSThread, f: Frame, oper: Operand) => {
    f.seek(oper);
};

/**
 * ifzjmp jumps to the instruction at the specified address if the top
 * of the stack is === 0.
 *
 * Stack:
 *
 * <uint32> ->
 */
export const ifzjmp = (_: JSThread, f: Frame, oper: Operand) => {
    let eValue = f.popValue();

    if (eValue.isLeft() || eValue.takeRight() === 0) f.seek(oper);
};

/**
 * ifnzjmp jumps to the instruction at the specified address if the top
 * of the stack is !== 0.
 *
 * Stack:
 * <uint32> ->
 */
export const ifnzjmp = (_: JSThread, f: Frame, oper: Operand) => {
    let eValue = f.popValue();

    if (eValue.isRight() && eValue.takeRight() !== 0) f.seek(oper);
};

/**
 * ifeqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export const ifeqjmp = (r: JSThread, f: Frame, oper: Operand) => {
    let eLhs = f.popValue();
    let eRhs = f.popValue();

    if (eLhs.isLeft()) r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft()) r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() === eRhs.takeRight()) f.seek(oper);
};

/**
 * ifneqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are not strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export const ifneqjmp = (r: JSThread, f: Frame, oper: Operand) => {
    let eLhs = f.popValue();
    let eRhs = f.popValue();

    if (eLhs.isLeft()) r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft()) r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() !== eRhs.takeRight()) f.seek(oper);
};
