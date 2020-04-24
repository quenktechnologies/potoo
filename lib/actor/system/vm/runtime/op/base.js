"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var array_1 = require("@quenk/noni/lib/data/array");
var frame_1 = require("../stack/frame");
/**
 * nop does nothing.
 *
 * Stack:
 *  ->
 */
exports.nop = function (_, __, ___) { };
/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 *
 * Stack:
 * -> <uint8>
 */
exports.pushui8 = function (_, f, oper) {
    f.pushUInt8(oper);
};
/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 *
 * Stack:
 *  -> <uint16>
 */
exports.pushui16 = function (_, f, oper) {
    f.pushUInt16(oper);
};
/**
 * pushui32 pushes an unsigned 32bit integer onto the stack.
 *
 * NOTE: In a future revision, the operand may be treated as an index.
 * Stack:
 *  -> <uint32>
 */
exports.pushui32 = function (_, f, oper) {
    f.pushUInt32(oper);
};
/**
 * lds loads a string from the constant pool onto the stack.
 *
 * Stack:
 *  -> <string>
 */
exports.lds = function (_, f, idx) {
    f.pushString(idx);
};
/**
 * ldn loads an info object from the compiled script.
 *
 * -> <value>
 */
exports.ldn = function (_, f, idx) {
    f.pushName(idx);
};
/**
 * dup duplicates the value on top of the data stack.
 *
 * Stack:
 * <any> -> <any>,<any>
 */
exports.dup = function (_, f, __) {
    f.duplicate();
};
/**
 * store the value at the top of the data stack in the variable indicated
 * by idx.
 *
 * Stack:
 * <any> ->
 */
exports.store = function (_, f, idx) {
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
exports.load = function (_, f, idx) {
    var d = f.locals[idx];
    f.push((d == null) ? 0 : d);
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
exports.ceq = function (r, f, __) {
    //TODO: Should null == null or raise an error?
    var eLhs = f.popValue();
    var eRhs = f.popValue();
    if (eLhs.isLeft())
        return r.raise(eLhs.takeLeft());
    if (eRhs.isLeft())
        return r.raise(eRhs.takeLeft());
    if (eLhs.takeRight() === eRhs.takeRight())
        f.push(1);
    else
        f.push(0);
};
/**
 * addui32 treats the top two operands on the data stack as uint32s and adds
 * them.
 *
 * The result is a 32 bit value. If the result is more than MAX_SAFE_INTEGER an
 * IntergerOverflowErr will be raised.
 */
exports.addui32 = function (r, f, _) {
    var val = f.pop() + f.pop();
    if (val > frame_1.DATA_MAX_SAFE_UINT32)
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
exports.call = function (r, f, _) {
    var einfo = f.popFunction();
    if (einfo.isLeft())
        return r.raise(einfo.takeLeft());
    var fn = einfo.takeRight();
    if (fn.foreign === true) {
        //TODO: This is unsafe but the extent of its effect on overall stability
        // should be compared to the time taken to ensure each value.
        var args = array_1.make(fn.argc || 0, function () { return f.popValue().takeRight(); });
        r.invokeForeign(f, fn, args);
    }
    else {
        r.invokeVM(f, fn);
    }
};
/**
 * raise an exception.
 *
 * Stack:
 *
 * <message> ->
 */
exports.raise = function (r, f, _) {
    var emsg = f.popString();
    r.raise(new Error(emsg.takeRight()));
};
/**
 * jmp jumps to the instruction at the specified address.
 *
 * Stack:
 *  ->
 */
exports.jmp = function (_, f, oper) {
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
exports.ifzjmp = function (_, f, oper) {
    var eValue = f.popValue();
    if ((eValue.isLeft()) || (eValue.takeRight() === 0))
        f.seek(oper);
};
/**
 * ifnzjmp jumps to the instruction at the specified address if the top
 * of the stack is !== 0.
 *
 * Stack:
 * <uint32> ->
 */
exports.ifnzjmp = function (_, f, oper) {
    var eValue = f.popValue();
    if ((eValue.isRight()) && (eValue.takeRight() !== 0))
        f.seek(oper);
};
/**
 * ifeqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
exports.ifeqjmp = function (r, f, oper) {
    var eLhs = f.popValue();
    var eRhs = f.popValue();
    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() === eRhs.takeRight())
        f.seek(oper);
};
/**
 * ifneqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are not strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
exports.ifneqjmp = function (r, f, oper) {
    var eLhs = f.popValue();
    var eRhs = f.popValue();
    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() !== eRhs.takeRight())
        f.seek(oper);
};
//# sourceMappingURL=base.js.map