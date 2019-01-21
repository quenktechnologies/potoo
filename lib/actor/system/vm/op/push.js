"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("@quenk/noni/lib/data/type");
var frame_1 = require("../frame");
var _1 = require("./");
exports.OP_CODE_PUSH_NUM = 0x1;
exports.OP_CODE_PUSH_STR = 0x2;
exports.OP_CODE_PUSH_TEMP = 0x3;
/**
 * PushNum pushes a literal number onto the stack.
 */
var PushNum = /** @class */ (function () {
    function PushNum(value) {
        this.value = value;
        this.code = exports.OP_CODE_PUSH_NUM;
        this.level = _1.Level.Base;
    }
    PushNum.prototype.exec = function (e) {
        e.current.push(this.value, frame_1.Type.Number, frame_1.Location.Literal);
    };
    PushNum.prototype.toLog = function () {
        return "pushnum " + this.value;
    };
    return PushNum;
}());
exports.PushNum = PushNum;
/**
 * PushStr pushes a string from the constants table onto the stack.
 */
var PushStr = /** @class */ (function () {
    function PushStr(value) {
        this.value = value;
        this.code = exports.OP_CODE_PUSH_STR;
        this.level = _1.Level.Base;
    }
    PushStr.prototype.exec = function (e) {
        e.current.push(this.value, frame_1.Type.String, frame_1.Location.Constants);
    };
    PushStr.prototype.toLog = function (f) {
        return "pushstr " + this.value + " " +
            ("// " + f.script.constants[frame_1.Type.String][this.value]);
    };
    return PushStr;
}());
exports.PushStr = PushStr;
/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
var PushTemp = /** @class */ (function () {
    function PushTemp(value) {
        this.value = value;
        this.code = exports.OP_CODE_PUSH_TEMP;
        this.level = _1.Level.Base;
    }
    PushTemp.prototype.exec = function (e) {
        e.current.push(this.value, frame_1.Type.Template, frame_1.Location.Constants);
    };
    PushTemp.prototype.toLog = function (f) {
        return "pushtemp " + this.value + " " +
            ("// " + type_1.show(f.script.constants[frame_1.Type.Template][this.value]));
    };
    return PushTemp;
}());
exports.PushTemp = PushTemp;
//# sourceMappingURL=push.js.map