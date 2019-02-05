"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("../frame");
var _1 = require("./");
/**
 * PushNum pushes a literal number onto the stack.
 */
var PushNum = /** @class */ (function () {
    function PushNum(index) {
        this.index = index;
        this.code = _1.OP_CODE_PUSH_NUM;
        this.level = _1.Level.Base;
    }
    PushNum.prototype.exec = function (e) {
        e.current().get().push(this.index, frame_1.Type.Number, frame_1.Location.Literal);
    };
    PushNum.prototype.toLog = function () {
        return ['pushnum', [this.index, frame_1.Type.Number, frame_1.Location.Literal], []];
    };
    return PushNum;
}());
exports.PushNum = PushNum;
/**
 * PushStr pushes a string from the constants table onto the stack.
 */
var PushStr = /** @class */ (function () {
    function PushStr(index) {
        this.index = index;
        this.code = _1.OP_CODE_PUSH_STR;
        this.level = _1.Level.Base;
    }
    PushStr.prototype.exec = function (e) {
        e.current().get().push(this.index, frame_1.Type.String, frame_1.Location.Constants);
    };
    PushStr.prototype.toLog = function () {
        return ['pushstr', [this.index, frame_1.Type.String, frame_1.Location.Constants], []];
    };
    return PushStr;
}());
exports.PushStr = PushStr;
/**
 * PushFunc pushes a function constant onto the stack.
 */
var PushFunc = /** @class */ (function () {
    function PushFunc(index) {
        this.index = index;
        this.code = _1.OP_CODE_PUSH_FUNC;
        this.level = _1.Level.Base;
    }
    PushFunc.prototype.exec = function (e) {
        e.current().get().push(this.index, frame_1.Type.Function, frame_1.Location.Constants);
    };
    PushFunc.prototype.toLog = function () {
        return ['pushfunc', [this.index, frame_1.Type.Function, frame_1.Location.Constants], []];
    };
    return PushFunc;
}());
exports.PushFunc = PushFunc;
/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
var PushTemp = /** @class */ (function () {
    function PushTemp(index) {
        this.index = index;
        this.code = _1.OP_CODE_PUSH_TEMP;
        this.level = _1.Level.Base;
    }
    PushTemp.prototype.exec = function (e) {
        e.current().get().push(this.index, frame_1.Type.Template, frame_1.Location.Constants);
    };
    PushTemp.prototype.toLog = function () {
        return ['pushtemp', [this.index, frame_1.Type.Template, frame_1.Location.Constants], []];
    };
    return PushTemp;
}());
exports.PushTemp = PushTemp;
/**
 * PushMsg pushes a message constant onto the stack.
 */
var PushMsg = /** @class */ (function () {
    function PushMsg(index) {
        this.index = index;
        this.code = _1.OP_CODE_PUSH_MSG;
        this.level = _1.Level.Base;
    }
    PushMsg.prototype.exec = function (e) {
        e.current().get().push(this.index, frame_1.Type.Message, frame_1.Location.Constants);
    };
    PushMsg.prototype.toLog = function () {
        return ['pushmsg', [this.index, frame_1.Type.Message, frame_1.Location.Constants], []];
    };
    return PushMsg;
}());
exports.PushMsg = PushMsg;
/**
 * PushForeign pushes a foreign function onto the stack.
 */
var PushForeign = /** @class */ (function () {
    function PushForeign(index) {
        this.index = index;
        this.code = _1.OP_CODE_PUSH_FOREIGN;
        this.level = _1.Level.Base;
    }
    PushForeign.prototype.exec = function (e) {
        e.current().get().push(this.index, frame_1.Type.Foreign, frame_1.Location.Constants);
    };
    PushForeign.prototype.toLog = function () {
        return ['pushmsg', [this.index, frame_1.Type.Foreign, frame_1.Location.Constants], []];
    };
    return PushForeign;
}());
exports.PushForeign = PushForeign;
//# sourceMappingURL=push.js.map