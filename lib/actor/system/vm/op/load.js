"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
exports.OP_CODE_LOAD = 0x12;
/**
 * Load the local stored at index onto the stack.
 *
 * Pushes:
 * 1. Value of index in locals table.
 */
var Load = /** @class */ (function () {
    function Load(index) {
        this.index = index;
        this.code = exports.OP_CODE_LOAD;
        this.level = _1.Level.Base;
    }
    Load.prototype.exec = function (e) {
        var _a = e.current.locals[this.index], value = _a[0], type = _a[1], location = _a[2];
        e.current.push(value, type, location);
    };
    Load.prototype.toLog = function (_) {
        return "load " + this.index;
    };
    return Load;
}());
exports.Load = Load;
//# sourceMappingURL=load.js.map