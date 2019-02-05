"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("../frame");
var _1 = require("./");
/**
 * Load the local stored at index onto the stack.
 *
 * Pushes:
 * 1. Value of index in locals table.
 */
var Load = /** @class */ (function () {
    function Load(index) {
        this.index = index;
        this.code = _1.OP_CODE_LOAD;
        this.level = _1.Level.Base;
    }
    Load.prototype.exec = function (e) {
        var curr = e.current().get();
        var _a = curr.locals[this.index], value = _a[0], type = _a[1], location = _a[2];
        curr.push(value, type, location);
    };
    Load.prototype.toLog = function (_) {
        return ['load', [this.index, frame_1.Type.Number, frame_1.Location.Literal], []];
    };
    return Load;
}());
exports.Load = Load;
//# sourceMappingURL=load.js.map