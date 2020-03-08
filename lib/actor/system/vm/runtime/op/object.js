"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var frame_1 = require("../stack/frame");
var heap_1 = require("../heap");
var type_1 = require("@quenk/noni/lib/data/type");
/**
 * getprop retrieves a property from an object.
 *
 * If the property is not already on the stack it will be entered there.
 *
 * Stack:
 *  <objectref> -> <value>
 */
exports.getprop = function (r, f, idx) {
    var econs = f.peekConstructor();
    if (econs.isLeft())
        return r.raise(econs.takeLeft());
    var cons = econs.takeRight();
    var mprop = maybe_1.fromNullable(cons.properties[frame_1.DATA_MASK_VALUE24 & idx]);
    if (mprop.isNothing()) {
        //TODO: note this is essentially creating a null/undefined reference on 
        // the data stack.
        f.push(0);
    }
    else {
        var eobj = f.popObject();
        if (eobj.isLeft())
            return r.raise(eobj.takeLeft());
        var obj = eobj.takeRight();
        var value = obj[mprop.get().name];
        var mref = f.heap.ref(value);
        return mref.isJust() ?
            mref.get() :
            f.push(f.heap.add(new heap_1.HeapEntry(cons.type, cons.builtin, value)));
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
    f.push(Array.isArray(obj) ? obj.length : 0);
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
    if (!Array.isArray(arr)) {
        f.push(0);
    }
    else {
        var value = arr[f.pop()];
        var mref = f.heap.ref(value);
        f.push(type_1.isNumber(value) ?
            value :
            mref.isJust() ?
                mref.get() :
                f.heap.add(value));
    }
};
//# sourceMappingURL=object.js.map