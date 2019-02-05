"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Noop does nothing.
 */
var Noop = /** @class */ (function () {
    function Noop() {
        this.code = _1.OP_CODE_NOOP;
        this.level = _1.Level.Base;
    }
    Noop.prototype.exec = function (_) {
    };
    Noop.prototype.toLog = function (_) {
        return ['noop', [], []];
    };
    return Noop;
}());
exports.Noop = Noop;
//# sourceMappingURL=noop.js.map