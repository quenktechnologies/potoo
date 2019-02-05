"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Cmp compares the top two values for equality.
 *
 * Pops:
 *
 * 1. Left value.
 * 2. Right value.
 *
 * Pushes:
 *
 * 1 if true, 0 if false
 */
var Cmp = /** @class */ (function () {
    function Cmp() {
        this.code = _1.OP_CODE_CMP;
        this.level = _1.Level.Base;
    }
    Cmp.prototype.exec = function (e) {
        var curr = e.current().get();
        curr
            .resolve(curr.pop())
            .chain(function (a) {
            return curr
                .resolve(curr.pop())
                .map(function (b) {
                if (a === b)
                    curr.pushNumber(1);
                else
                    curr.pushNumber(0);
            });
        })
            .lmap(function (err) { return e.raise(err); });
    };
    Cmp.prototype.toLog = function (f) {
        return ['cmp', [], [f.peek(), f.peek(1)]];
    };
    return Cmp;
}());
exports.Cmp = Cmp;
//# sourceMappingURL=cmp.js.map