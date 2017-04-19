"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("../monad/Maybe");
var IO_1 = require("../monad/IO");
/**
 * SharedBuffer is an abstraction for collecting values safely
 * from async paths of execution.
 *
 * The reasoning here is that our side-effect free code will only take
 * the value when it's ready, in the meantime we store whatever values
 * returned here.
 */
var SharedBuffer = (function () {
    function SharedBuffer() {
        this.value = [];
    }
    SharedBuffer.prototype.put = function (v) {
        var _this = this;
        return IO_1.safeIO(function () { return void _this.value.push(v); });
    };
    SharedBuffer.prototype.take = function () {
        var _this = this;
        return IO_1.safeIO(function () { return _this.value.shift(); });
    };
    SharedBuffer.prototype.maybeTake = function () {
        return this.take().map(Maybe_1.fromAny);
    };
    return SharedBuffer;
}());
exports.SharedBuffer = SharedBuffer;
//# sourceMappingURL=SharedBuffer.js.map