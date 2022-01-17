"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arelm = exports.arlength = exports.getprop = void 0;
/**
 * getprop retrieves a property from an object.
 *
 * Stack:
 *  <objectref> -> <value>
 */
const getprop = (r, f, idx) => {
    let eobj = f.popObject();
    if (eobj.isLeft())
        return r.raise(eobj.takeLeft());
    let obj = eobj.takeRight();
    let mval = obj.get(idx);
    if (mval.isJust()) {
        f.push(r.vm.heap.intern(f, mval.get()));
    }
    else {
        //TODO: This is a null reference!
        f.push(0);
    }
};
exports.getprop = getprop;
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
const arlength = (r, f, _) => {
    let eobj = f.popObject();
    if (eobj.isLeft())
        return r.raise(eobj.takeLeft());
    let obj = eobj.takeRight();
    f.push(obj.getCount());
};
exports.arlength = arlength;
/**
 * arelm provides the array element at the specified index.
 *
 * If the element is not a primitive it will be placed on the heap.
 *
 * Stack:
 *
 * <arrayref>,<index> -> <element>
 */
const arelm = (r, f, _) => {
    let earr = f.popObject();
    if (earr.isLeft())
        return r.raise(earr.takeLeft());
    let arr = earr.takeRight();
    let melm = arr.get(f.pop());
    if (melm.isJust()) {
        f.push(r.vm.heap.intern(f, melm.get()));
    }
    else {
        f.push(0);
    }
};
exports.arelm = arelm;
//# sourceMappingURL=object.js.map