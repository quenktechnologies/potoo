import { Frame, } from '../stack/frame';
import { Runtime, Operand } from '../';

/**
 * getprop retrieves a property from an object.
 *
 * Stack:
 *  <objectref> -> <value>
 */
export const getprop = (r: Runtime, f: Frame, idx: Operand) => {

    let eobj = f.popObject();

    if (eobj.isLeft())
        return r.raise(eobj.takeLeft());

    let obj = eobj.takeRight();

    let mval = obj.get(idx);

    if (mval.isJust()) {

        f.push(r.heap.getAddress(mval.get()));

    } else {

        //TODO: This is a null reference!
        f.push(0);

    }

}

/**
 * arlength pushes the length of an array on the top of the stack onto 
 * the stack.
 *
 * If the reference at the top of the stack is not an array the value will 
 * always be zero.
 *
 * Stack:
 * <arrayref> -> <uint32>
 */
export const arlength = (r: Runtime, f: Frame, _: Operand) => {

    let eobj = f.popObject();

    if (eobj.isLeft()) return r.raise(eobj.takeLeft());

    let obj = eobj.takeRight();

    f.push(obj.getCount());

}

/**
 * arelm provides the array element at the specified index.
 *
 * If the element is not a primitive it will be placed on the heap.
 *
 * Stack:
 *
 * <arrayref>,<index> -> <element>
 */
export const arelm = (r: Runtime, f: Frame, _: Operand) => {
    console.error('----> ', f.data, f.locals);
    let earr = f.popObject();

    if (earr.isLeft()) return r.raise(earr.takeLeft());

    let arr = earr.takeRight();

    let melm = arr.get(f.pop());

    if (melm.isJust()) {

        f.push(r.heap.getAddress(melm.get()));

    } else {

        f.push(0);

    }

}
