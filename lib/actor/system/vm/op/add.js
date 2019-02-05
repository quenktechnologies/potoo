"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Add the top two operands of the stack.
 *
 * Pops:
 * 1. The first value.
 * 2. The second value.
 *
 * Pushes:
 *
 * The result of adding the two numbers.
 */
var Add = /** @class */ (function () {
    function Add() {
        this.code = _1.OP_CODE_ADD;
        this.level = _1.Level.Base;
    }
    Add.prototype.exec = function (e) {
        var curr = e.current().get();
        var eitherA = curr.resolveNumber(curr.pop());
        var eitherB = curr.resolveNumber(curr.pop());
        if (eitherA.isLeft())
            return e.raise(eitherA.takeLeft());
        if (eitherB.isLeft())
            return e.raise(eitherB.takeLeft());
        curr.pushNumber(eitherA.takeRight() + eitherB.takeRight());
    };
    Add.prototype.toLog = function (f) {
        return ['add', [], [f.peek(), f.peek(1)]];
    };
    return Add;
}());
exports.Add = Add;
//# sourceMappingURL=add.js.map