"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arelm = exports.arlength = exports.getprop = void 0;
/**
 * getprop retrieves a property from an object.
 *
 * Stack:
 *  <objectref> -> <value>
 */
exports.getprop = function (r, f, idx) {
    var eobj = f.popObject();
    if (eobj.isLeft())
        return r.raise(eobj.takeLeft());
    var obj = eobj.takeRight();
    var mval = obj.get(idx);
    if (mval.isJust()) {
        f.push(r.heap.getAddress(mval.get()));
    }
    else {
        //TODO: This is a null reference!
        f.push(0);
    }
};
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
exports.arlength = function (r, f, _) {
    var eobj = f.popObject();
    if (eobj.isLeft())
        return r.raise(eobj.takeLeft());
    var obj = eobj.takeRight();
    f.push(obj.getCount());
};
/**
 * arelm provides the array element at the specified index.
 *
 * If the element is not a primitive it will be placed on the heap.
 *
 * Stack:
 *
 * <arrayref>,<index> -> <element>
 */
exports.arelm = function (r, f, _) {
    var earr = f.popObject();
    if (earr.isLeft())
        return r.raise(earr.takeLeft());
    var arr = earr.takeRight();
    var melm = arr.get(f.pop());
    if (melm.isJust()) {
        f.push(r.heap.getAddress(melm.get()));
    }
    else {
        f.push(0);
    }
};
//# sourceMappingURL=object.js.map