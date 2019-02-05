"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("../frame");
var _1 = require("./");
/**
 * Store the top most value on the stack in the locals array at the
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
var Store = /** @class */ (function () {
    function Store(index) {
        this.index = index;
        this.code = _1.OP_CODE_STORE;
        this.level = _1.Level.Base;
    }
    Store.prototype.exec = function (e) {
        var curr = e.current().get();
        curr.locals[this.index] = curr.pop();
    };
    Store.prototype.toLog = function (f) {
        return ['store', [this.index, frame_1.Type.Number, frame_1.Location.Literal], [f.peek()]];
    };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=store.js.map