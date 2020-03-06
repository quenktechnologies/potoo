import * as error from '../error';

import { make } from '@quenk/noni/lib/data/array';

import { Frame, DATA_MAX_SAFE_UINT32 } from '../stack/frame';
import { Runtime, Operand, OperandU16 } from '../';
import { HeapEntry } from '../heap';

/**
 * nop does nothing.
 *
 * Stack:
 *  ->
 */
export const nop = (_: Runtime, __: Frame, ___: Operand) => { }

/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 *
 * Stack:
 * -> <uint8>
 */
export const pushui8 = (_: Runtime, f: Frame, args: Operand) => {

    f.pushUInt8(args);

}

/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 *
 * Stack:
 *  -> <uint16>
 */
export const pushui16 = (_: Runtime, f: Frame, args: Operand) => {

    f.pushUInt16(args);

}

/**
 * pushui32 pushes an unsigned 32bit integer onto the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export const pushui32 = (_: Runtime, f: Frame, args: Operand) => {

    f.pushUInt32(args);

}

/**
 * pushstr pushes a string onto the stack.
 *
 * Stack:
 *  -> <string>
 */
export const pushstr = (_: Runtime, f: Frame, args: Operand) => {

    f.pushString(args);

}

/**
 * pushfun pushes a function onto the stack.
 *
 * Stack:
 * -> <fun>
 */
export const pushfun = (_: Runtime, f: Frame, idx: OperandU16) => {

    f.pushFunction(idx);

}

/**
 * pushrec pushes a receiver onto the stack.
 *
 * Stack:
 *
 * -> <receiver>
 */
export const pushrecv = (_: Runtime, f: Frame, idx: OperandU16) => {

    f.pushReceiver(idx);

}

/**
 * dup duplicates the value on top of the data stack.
 *
 * Stack:
 * <any> -> <any>,<any>
 */
export const dup = (_: Runtime, f: Frame, __: Operand) => {

    f.duplicate();

}

/**
 * store the value at the top of the data stack in the variable indicated
 * by idx.
 *
 * Stack:
 * <any> -> 
 */
export const store = (_: Runtime, f: Frame, idx: Operand) => {

    f.locals[idx] = f.pop();

}

/**
 * load the value stored at idx in the variables array onto the top of the 
 * stack.
 *
 * If the variable is undefined 0 is placed on the stack.
 *
 * Stack:
 *  -> <any>
 */
export const load = (_: Runtime, f: Frame, idx: Operand) => {

    let d = f.locals[idx];

    f.push((d == null) ? 0 : d);

}

/**
 * ceq compares two values for equality.
 *
 * Pushes 1 if true, 0 otherwise.
 *
 * Stack:
 *
 * <val1>,<val2> -> <unint32>
 */
export const ceq = (r: Runtime, f: Frame, __: Operand) => {

    //TODO: Should null == null or raise an error?

    let eLhs = f.popValue();

    let eRhs = f.popValue();

    if (eLhs.isLeft()) return r.vm.raise(eLhs.takeLeft());

    if (eRhs.isLeft()) return r.vm.raise(eRhs.takeLeft());

    if (eLhs.takeRight() === eRhs.takeRight())
        f.push(1);
    else
        f.push(0);

}

/**
 * addui32 treats the top two operands on the data stack as uint32s and adds
 * them. 
 *
 * The result is a 32 bit value. If the result is more than MAX_SAFE_INTEGER an 
 * IntergerOverflowErr will be raised.
 */
export const addui32 = (r: Runtime, f: Frame, _: Operand) => {

    let val = f.pop() + f.pop();

    if (val > DATA_MAX_SAFE_UINT32)
        return r.raise(new error.IntegerOverflowErr());

    f.push(val);

}

/**
 * call a function placing its result on the heap.
 *
 * Note: only foreign functions are supported at this time.
 *
 * Stack:
 *
 * <arg>...? -> <result> 
 */
export const call = (r: Runtime, f: Frame, n: Operand) => {

    //TODO: This is unsafe but the extent of its effect on overall stability
    // should be compared to the time taken to ensure each value.
    let args = make(n, () => f.popValue().takeRight());

    let einfo = f.popFunction();

    if (einfo.isLeft()) return r.raise(einfo.takeLeft());

    let fn = einfo.takeRight();

    //TODO: Support pvm functions.

    //Todo: Note the type of the heap entry is the function type.
    //We should add some plumbing for strings, numbers etc.
    f.push(f.heap.add(new HeapEntry(fn.type,
        <object>(<Function>fn.exec).apply(null, args))));

}
