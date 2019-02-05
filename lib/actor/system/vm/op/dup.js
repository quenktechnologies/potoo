"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Dup duplicates the current value at the top of the stack.
 */
var Dup = /** @class */ (function () {
    function Dup() {
        this.code = _1.OP_CODE_DUP;
        this.level = _1.Level.Base;
    }
    Dup.prototype.exec = function (e) {
        var curr = e.current().get();
        var _a = curr.pop(), value = _a[0], type = _a[1], location = _a[2];
        curr.push(value, type, location);
        curr.push(value, type, location);
    };
    Dup.prototype.toLog = function (f) {
        return ['dup', [], [f.peek()]];
    };
    return Dup;
}());
exports.Dup = Dup;
//# sourceMappingURL=dup.js.map