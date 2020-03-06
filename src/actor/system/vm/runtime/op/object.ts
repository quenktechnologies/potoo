import { fromNullable } from '@quenk/noni/lib/data/maybe';

import { Frame, DATA_MASK_VALUE24 } from '../stack/frame';
import { Runtime, Operand } from '../';
import { HeapEntry, HeapObject } from '../heap';
import { isNumber } from '@quenk/noni/lib/data/type';

/**
 * getprop retrieves a property from an object.
 *
 * If the property is not already on the stack it will be entered there.
 *
 * Stack:
 *  <objectref> -> <value>
 */
export const getprop = (r: Runtime, f: Frame, idx: Operand) => {

    let mword = f.peek();

    let econs = f.peekConstructor();

    if (econs.isLeft()) return r.raise(econs.takeLeft());

    let cons = econs.takeRight();

    let mprop = fromNullable(cons.properties[DATA_MASK_VALUE24 & idx]);

    if (mprop.isNothing()) {

        //TODO: note this is essentially creating a null/undefined reference on 
        // the data stack.
        f.push(0);

    } else {

        let eobj = f.popObject();

        if (eobj.isLeft()) return r.raise(eobj.takeLeft());

        let obj = <HeapObject>eobj.takeRight();

        let value = obj[mprop.get().name];

        let mref = f.heap.ref(value);

        let typ = mword.get() & DATA_MASK_VALUE24;

        return mref.isJust() ?
            mref.get() :
            f.push(f.heap.add(new HeapEntry(typ, value)));

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

    f.push(Array.isArray(obj) ? obj.length : 0);

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

    let earr = f.popObject();

    if (earr.isLeft()) return r.raise(earr.takeLeft());

    let arr = earr.takeRight();

    if (!Array.isArray(arr)) {

        f.push(0);

    } else {

        let value = arr[f.pop()];

        let mref = f.heap.ref(value);

        f.push(isNumber(value) ?
            value :
            mref.isJust() ?
                mref.get() :
                f.heap.add(value));

    }

}
