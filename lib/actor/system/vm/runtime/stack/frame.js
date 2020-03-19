"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var indexes = require("../../script");
var error = require("../error");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var array_1 = require("@quenk/noni/lib/data/array");
var info_1 = require("../../script/info");
exports.DATA_RANGE_TYPE_HIGH = 0x7f000000;
exports.DATA_RANGE_TYPE_LOW = 0x1000000;
exports.DATA_RANGE_TYPE_STEP = 0x1000000;
// Used to extract the desired part via &
exports.DATA_MASK_TYPE = 0xff000000;
exports.DATA_MASK_VALUE8 = 0xff;
exports.DATA_MASK_VALUE16 = 0xffff;
exports.DATA_MASK_VALUE24 = 0xffffff;
exports.DATA_MASK_VALUE32 = 0x7fffffff;
exports.DATA_MAX_SIZE = 0x7fffffff;
exports.DATA_MAX_SAFE_UINT32 = 0x7fffffff;
//These really indicate where the actual value of an operand is stored.
//They are not meant to be used to check the actual type of the underlying value.
exports.DATA_TYPE_UINT8 = exports.DATA_RANGE_TYPE_STEP;
exports.DATA_TYPE_UINT16 = exports.DATA_RANGE_TYPE_STEP * 2;
exports.DATA_TYPE_STRING = exports.DATA_RANGE_TYPE_STEP * 3;
exports.DATA_TYPE_SYMBOL = exports.DATA_RANGE_TYPE_STEP * 4;
exports.DATA_TYPE_HEAP = exports.DATA_RANGE_TYPE_STEP * 6;
exports.DATA_TYPE_LOCAL = exports.DATA_RANGE_TYPE_STEP * 7;
exports.DATA_TYPE_MAILBOX = exports.DATA_RANGE_TYPE_STEP * 8;
/**
 * StackFrame (Frame implementation).
 */
var StackFrame = /** @class */ (function () {
    function StackFrame(name, script, context, heap, code, data, rdata, locals, ip) {
        if (code === void 0) { code = []; }
        if (data === void 0) { data = []; }
        if (rdata === void 0) { rdata = []; }
        if (locals === void 0) { locals = []; }
        if (ip === void 0) { ip = 0; }
        this.name = name;
        this.script = script;
        this.context = context;
        this.heap = heap;
        this.code = code;
        this.data = data;
        this.rdata = rdata;
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
    StackFrame.prototype.pushSymbol = function (idx) {
        return this.push(idx | exports.DATA_TYPE_SYMBOL);
    };
    StackFrame.prototype.pushMessage = function () {
        return this.push(0 | exports.DATA_TYPE_MAILBOX);
    };
    StackFrame.prototype.peek = function () {
        //TODO: Return 0 instead of Maybe?
        return maybe_1.fromNullable(array_1.tail(this.data));
    };
    StackFrame.prototype.peekConstructor = function () {
        var mword = this.peek();
        if (mword.isNothing())
            return either_1.left(new error.NullPointerErr(0));
        var word = exports.DATA_MASK_VALUE24 & mword.get();
        var info = this.script.info[exports.DATA_MASK_VALUE24 & word];
        if ((info == null) || (info.infoType !== info_1.INFO_TYPE_CONSTRUCTOR))
            return either_1.left(new error.NullPointerErr(word));
        return either_1.right(info);
    };
    StackFrame.prototype.resolve = function (data) {
        var _a = this, script = _a.script, context = _a.context;
        var typ = data & exports.DATA_MASK_TYPE;
        var value = data & exports.DATA_MASK_VALUE24;
        switch (typ) {
            case exports.DATA_TYPE_STRING:
                var mstr = maybe_1.fromNullable(script.constants[indexes.CONSTANTS_INDEX_STRING][value]);
                return either_1.right(mstr.get());
            case exports.DATA_TYPE_SYMBOL:
                var info = this.script.info[value];
                if (info == null)
                    return either_1.left(new error.MissingSymbolErr(value));
                return either_1.right(info);
            case exports.DATA_TYPE_HEAP:
                var mO = this.heap.get(typ);
                if (mO.isNothing())
                    return either_1.left(new error.NullPointerErr(data));
                return either_1.right(mO.get());
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
            default:
                return either_1.right(value);
        }
    };
    StackFrame.prototype.pop = function () {
        return (this.data.pop() | 0);
    };
    StackFrame.prototype.popValue = function () {
        return this.resolve(this.pop());
    };
    StackFrame.prototype.popString = function () {
        return this.popValue();
    };
    StackFrame.prototype.popFunction = function () {
        return this.popValue();
    };
    StackFrame.prototype.popObject = function () {
        return this.popValue();
    };
    StackFrame.prototype.popTemplate = function () {
        return this.popValue();
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
//# sourceMappingURL=frame.js.map