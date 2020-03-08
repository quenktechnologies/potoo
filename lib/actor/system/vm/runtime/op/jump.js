"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * jmp jumps to the instruction at the specified address.
 *
 * Stack:
 *  ->
 */
exports.jmp = function (_, f, args) {
    f.ip = args;
};
/**
 * ifzjmp jumps to the instruction at the specified address if the top
 * of the stack is === 0.
 *
 * Stack:
 *
 * <uint32> ->
 */
exports.ifzjmp = function (_, f, args) {
    var eValue = f.popValue();
    if ((eValue.isLeft()) || (eValue.takeRight() === 0))
        f.ip = args;
};
/**
 * ifnzjmp jumps to the instruction at the specified address if the top
 * of the stack is !== 0.
 *
 * Stack:
 * <uint32> ->
 */
exports.ifnzjmp = function (_, f, args) {
    var eValue = f.popValue();
    if ((eValue.isRight()) && (eValue.takeRight() !== 0))
        f.ip = args;
};
/**
 * ifeqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
exports.ifeqjmp = function (r, f, args) {
    var eLhs = f.popValue();
    var eRhs = f.popValue();
    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() === eRhs.takeRight())
        f.ip = args;
};
/**
 * ifneqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are not strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
exports.ifneqjmp = function (r, f, args) {
    var eLhs = f.popValue();
    var eRhs = f.popValue();
    if (eLhs.isLeft())
        r.raise(eLhs.takeLeft());
    else if (eRhs.isLeft())
        r.raise(eRhs.takeLeft());
    else if (eLhs.takeRight() !== eRhs.takeRight())
        f.ip = args;
};
//# sourceMappingURL=jump.js.map