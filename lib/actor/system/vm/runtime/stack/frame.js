"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var indexes = require("../../script");
var error = require("../error");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var type_1 = require("../../type");
exports.DATA_RANGE_TYPE_HIGH = 0xf0000000;
exports.DATA_RANGE_TYPE_LOW = 0x1000000;
exports.DATA_RANGE_TYPE_STEP = 0x1000000;
// Used to extract the desired part via &
exports.DATA_MASK_TYPE = 0xff000000;
exports.DATA_MASK_VALUE8 = 0xff;
exports.DATA_MASK_VALUE16 = 0xffff;
exports.DATA_MASK_VALUE24 = 0xffffff;
exports.DATA_MASK_VALUE32 = 0xffffffff;
exports.DATA_MAX_SIZE = 0xffffffff;
exports.DATA_MAX_SAFE_UINT32 = 0x7fffffff;
//These really indicate where the actual value of an operand is stored.
//They are not meant to be used to check the actual type of the underlying value.
exports.DATA_TYPE_STRING = exports.DATA_RANGE_TYPE_STEP * 3;
exports.DATA_TYPE_INFO = exports.DATA_RANGE_TYPE_STEP * 4;
exports.DATA_TYPE_HEAP_OBJECT = exports.DATA_RANGE_TYPE_STEP * 6;
exports.DATA_TYPE_HEAP_STRING = exports.DATA_RANGE_TYPE_STEP * 7;
exports.DATA_TYPE_LOCAL = exports.DATA_RANGE_TYPE_STEP * 8;
exports.DATA_TYPE_MAILBOX = exports.DATA_RANGE_TYPE_STEP * 9;
exports.DATA_TYPE_SELF = exports.DATA_RANGE_TYPE_STEP * 10;
exports.BYTE_CONSTANT_NUM = 0x10000;
exports.BYTE_CONSTANT_STR = 0x20000;
exports.BYTE_CONSTANT_INFO = 0x30000;
/**
 * StackFrame (Frame implementation).
 */
var StackFrame = /** @class */ (function () {
    function StackFrame(name, script, context, heap, code, data, locals, ip) {
        if (code === void 0) { code = []; }
        if (data === void 0) { data = []; }
        if (locals === void 0) { locals = []; }
        if (ip === void 0) { ip = 0; }
        this.name = name;
        this.script = script;
        this.context = context;
        this.heap = heap;
        this.code = code;
        this.data = data;
        this.locals = locals;
        this.ip = ip;
    }
    StackFrame.prototype.push = function (d) {
        this.data.push(d);
        return this;
    };
    StackFrame.prototype.pushUInt8 = function (value) {
        return this.push((value >>> 0) & exports.DATA_MASK_VALUE8);
    };
    StackFrame.prototype.pushUInt16 = function (value) {
        return this.push((value >>> 0) & exports.DATA_MASK_VALUE16);
    };
    StackFrame.prototype.pushUInt32 = function (value) {
        return this.push(value >>> 0);
    };
    StackFrame.prototype.pushString = function (idx) {
        return this.push(idx | exports.DATA_TYPE_STRING);
    };
    StackFrame.prototype.pushName = function (idx) {
        return this.push(idx | exports.DATA_TYPE_INFO);
    };
    StackFrame.prototype.pushMessage = function () {
        return this.push(0 | exports.DATA_TYPE_MAILBOX);
    };
    StackFrame.prototype.pushSelf = function () {
        return this.push(exports.DATA_TYPE_SELF);
    };
    StackFrame.prototype.peek = function (n) {
        if (n === void 0) { n = 0; }
        return maybe_1.fromNullable(this.data.length - (n + 1));
    };
    StackFrame.prototype.resolve = function (data) {
        var context = this.context;
        var typ = data & exports.DATA_MASK_TYPE;
        var value = data & exports.DATA_MASK_VALUE24;
        switch (typ) {
            //TODO: This is probably not needed.
            case exports.DATA_TYPE_LOCAL:
                var mRef = maybe_1.fromNullable(this.locals[value]);
                if (mRef.isNothing())
                    return nullErr(data);
                //TODO: review call stack safety of this recursive call.
                return this.resolve(mRef.get());
            case exports.DATA_TYPE_MAILBOX:
                if (context.mailbox.length === 0)
                    return nullErr(data);
                //messages are always accessed sequentially FIFO
                return either_1.right(context.mailbox.shift());
            case exports.DATA_TYPE_SELF:
                return either_1.right(context.address);
            //TODO: This sometimes results in us treating 0 as a legitimate
            //value whereas it should be an error. However, 0 is a valid value
            //for numbers, and booleans. Needs review, solution may be in ops
            //rather than here.
            default:
                return either_1.right(value);
        }
    };
    StackFrame.prototype.pop = function () {
        return (this.data.pop() | 0);
    };
    StackFrame.prototype.popValue = function () {
        return (this.data.length === 0) ?
            either_1.left(new error.StackEmptyErr()) :
            this.resolve(this.pop());
    };
    StackFrame.prototype.popString = function () {
        var data = this.pop();
        var typ = data & exports.DATA_MASK_TYPE;
        var idx = data & exports.DATA_MASK_VALUE24;
        if (typ === exports.DATA_TYPE_STRING) {
            var s = this.script.constants[indexes.CONSTANTS_INDEX_STRING][idx];
            if (s == null)
                return missingSymbol(data);
            return either_1.right(s);
        }
        else if (typ === exports.DATA_TYPE_HEAP_STRING) {
            return either_1.right(this.heap.getString(idx));
        }
        else {
            return wrongType(exports.DATA_TYPE_STRING, typ);
        }
    };
    StackFrame.prototype.popName = function () {
        var data = this.pop();
        var typ = data & exports.DATA_MASK_TYPE;
        var idx = data & exports.DATA_MASK_VALUE24;
        if (typ === exports.DATA_TYPE_INFO) {
            var info = this.script.info[idx];
            if (info == null)
                return nullErr(data);
            return either_1.right(info);
        }
        else {
            return wrongType(exports.DATA_TYPE_INFO, data);
        }
    };
    StackFrame.prototype.popFunction = function () {
        return this
            .popName()
            .chain(function (nfo) {
            if ((nfo.descriptor & type_1.BYTE_TYPE) !== type_1.TYPE_FUN)
                return notAFunction(nfo.name);
            return either_1.right(nfo);
        });
    };
    StackFrame.prototype.popObject = function () {
        var data = this.pop();
        var typ = data & exports.DATA_MASK_TYPE;
        var idx = data & exports.DATA_MASK_VALUE24;
        if (typ === exports.DATA_TYPE_HEAP_OBJECT) {
            var mho = this.heap.getObject(idx);
            if (mho.isNothing())
                return nullErr(data);
            return either_1.right(mho.get());
        }
        else {
            return wrongType(exports.DATA_TYPE_HEAP_OBJECT, typ);
        }
    };
    StackFrame.prototype.duplicate = function () {
        var top = this.data.pop();
        this.data.push(top);
        this.data.push(top);
        return this;
    };
    return StackFrame;
}());
exports.StackFrame = StackFrame;
var nullErr = function (data) {
    return either_1.left(new error.NullPointerErr(data));
};
var wrongType = function (expect, got) {
    return either_1.left(new error.UnexpectedDataType(expect, got));
};
var notAFunction = function (name) {
    return either_1.left(new error.InvalidFunctionErr(name));
};
var missingSymbol = function (data) {
    return either_1.left(new error.MissingSymbolErr(data));
};
//# sourceMappingURL=frame.js.map