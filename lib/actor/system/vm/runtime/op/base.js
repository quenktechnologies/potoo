"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifneqjmp = exports.ifeqjmp = exports.ifnzjmp = exports.ifzjmp = exports.jmp = exports.raise = exports.call = exports.addui32 = exports.ceq = exports.load = exports.store = exports.dup = exports.ldn = exports.lds = exports.pushui32 = exports.pushui16 = exports.pushui8 = exports.nop = void 0;
const error = require("../error");
const array_1 = require("@quenk/noni/lib/data/array");
const frame_1 = require("../stack/frame");
/**
 * nop does nothing.
 *
 * Stack:
 *  ->
 */
const nop = (_, __, ___) => { };
exports.nop = nop;
/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 *
 * Stack:
 * -> <uint8>
 */
const pushui8 = (_, f, oper) => {
    f.pushUInt8(oper);
};
exports.pushui8 = pushui8;
/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 *
 * Stack:
 *  -> <uint16>
 */
const pushui16 = (_, f, oper) => {
    f.pushUInt16(oper);
};
exports.pushui16 = pushui16;
/**
 * pushui32 pushes an unsigned 32bit integer onto the stack.
 *
 * NOTE: In a future revision, the operand may be treated as an index.
 * Stack:
 *  -> <uint32>
 */
const pushui32 = (_, f, oper) => {
    f.pushUInt32(oper);
};
exports.pushui32 = pushui32;
/**
 * lds loads a string from the constant pool onto the stack.
 *
 * Stack:
 *  -> <string>
 */
const lds = (_, f, idx) => {
    f.pushString(idx);
};
exports.lds = lds;
/**
 * ldn loads an info object from the compiled script.
 *
 * -> <value>
 */
const ldn = (_, f, idx) => {
    f.pushName(idx);
};
exports.ldn = ldn;
/**
 * dup duplicates the value on top of the data stack.
 *
 * Stack:
 * <any> -> <any>,<any>
 */
const dup = (_, f, __) => {
    f.duplicate();
};
exports.dup = dup;
/**
 * store the value at the top of the data stack in the variable indicated
 * by idx.
 *
 * Stack:
 * <any> ->
 */
const store = (_, f, idx) => {
    f.locals[idx] = f.pop();
};
exports.store = store;
/**
 * load the value stored at idx in the variables array onto the top of the
 * stack.
 *
 * If the variable is undefined 0 is placed on the stack.
 *
 * Stack:
 *  -> <any>
 */
const load = (_, f, idx) => {
    let d = f.locals[idx];
    f.push((d == null) ? 0 : d);
};
exports.load = load;
/**
 * ceq compares two values for equality.
 *
 * Pushes 1 if true, 0 otherwise.
 *
 * Stack:
 *
 * <val1>,<val2> -> <unint32>
 */
const ceq = (r, f, __) => {
    //TODO: Should null == null or raise an error?
    let eLhs = f.popValue();
    let eRhs = f.popValue();
    if (eLhs.isLeft())
        return r.raise(eLhs.takeLeft());
    if (eRhs.isLeft())
        return r.raise(eRhs.takeLeft());
    if (eLhs.takeRight() === eRhs.takeRight())
        f.push(1);
    else
        f.push(0);
};
exports.ceq = ceq;
/**
 * addui32 treats the top two operands on the data stack as uint32s and adds
 * them.
 *
 * The result is a 32 bit value. If the result is more than MAX_SAFE_INTEGER an
 * IntergerOverflowErr will be raised.
 */
const addui32 = (r, f, _) => {
    let val = f.pop() + f.pop();
    if (val > frame_1.DATA_MAX_SAFE_UINT32)
        return r.raise(new error.IntegerOverflowErr());
    f.push(val);
};
exports.addui32 = addui32;
/**
 * call a function placing its result on the heap.
 *
 * Stack:
 *
 * <arg>...? -> <result>
 */
const call = (r, f, _) => {
    let einfo = f.popFunction();
    if (einfo.isLeft())
        return r.raise(einfo.takeLeft());
    let fn = einfo.takeRight();
    if (fn.foreign === true) {
        //TODO: This is unsafe but the extent of its effect on overall stability
        // should be compared to the time taken to ensure each value.
        let args = (0, array_1.make)(fn.argc || 0, () => f.popValue().takeRight());
        r.invokeForeign(f, fn, args);
    }
    else {
        r.invokeVM(f, fn);
    }
};
exports.call = call;
/**
 * raise an exception.
 *
 * Stack:
 *
 * <message> ->
 */
const raise = (r, f, _) => {
    let emsg = f.popString();
    r.raise(new Error(emsg.takeRight()));
};
exports.raise = raise;
/**
 * jmp jumps to the instruction at the specified address.
 *
 * Stack:
 *  ->
 */
const jmp = (_, f, oper) => {
    f.seek(oper);
};
exports.jmp = jmp;
/**
 * ifzjmp jumps to the instruction at the specified address if the top
 * of the stack is === 0.
 *
 * Stack:
 *
 * <uint32> ->
 */
const ifzjmp = (_, f, oper) => {
    let eValue = f.popValue();
    if ((eValue.isLeft()) || (eValue.takeRight() === 0))
        f.seek(oper);
};
exports.ifzjmp = ifzjmp;
/**
 * ifnzjmp jumps to the instruction at the specified address if the top
 * of the stack is !== 0.
 *
 * Stack:
 * <uint32> ->
 */
const ifnzjmp = (_, f, oper) => {
    let eValue = f.popValue();
    if ((eValue.isRight()) && (eValue.takeRight() !== 0))
        f.seek(oper);
};
exports.ifnzjmp = ifnzjmp;
/**
 * ifeqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
const ifeqjmp = (r, f, oper) => {
    let eLhs = f.popValue();
    let eRhs = f.popValue();
    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() === eRhs.takeRight())
        f.seek(oper);
};
exports.ifeqjmp = ifeqjmp;
/**
 * ifneqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are not strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
const ifneqjmp = (r, f, oper) => {
    let eLhs = f.popValue();
    let eRhs = f.popValue();
    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() !== eRhs.takeRight())
        f.seek(oper);
};
exports.ifneqjmp = ifneqjmp;
//# sourceMappingURL=base.js.map