"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackFrame = exports.BYTE_CONSTANT_INFO = exports.BYTE_CONSTANT_STR = exports.BYTE_CONSTANT_NUM = exports.DATA_TYPE_SELF = exports.DATA_TYPE_MAILBOX = exports.DATA_TYPE_LOCAL = exports.DATA_TYPE_HEAP_FUN = exports.DATA_TYPE_HEAP_FOREIGN = exports.DATA_TYPE_HEAP_OBJECT = exports.DATA_TYPE_HEAP_STRING = exports.DATA_TYPE_INFO = exports.DATA_TYPE_STRING = exports.DATA_MAX_SAFE_UINT32 = exports.DATA_MAX_SIZE = exports.DATA_MASK_VALUE32 = exports.DATA_MASK_VALUE24 = exports.DATA_MASK_VALUE16 = exports.DATA_MASK_VALUE8 = exports.DATA_MASK_TYPE = exports.DATA_RANGE_TYPE_STEP = exports.DATA_RANGE_TYPE_LOW = exports.DATA_RANGE_TYPE_HIGH = void 0;
const indexes = require("../../script");
const error = require("../error");
const either_1 = require("@quenk/noni/lib/data/either");
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const type_1 = require("../../type");
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
exports.DATA_TYPE_HEAP_STRING = exports.DATA_RANGE_TYPE_STEP * 6;
exports.DATA_TYPE_HEAP_OBJECT = exports.DATA_RANGE_TYPE_STEP * 7;
exports.DATA_TYPE_HEAP_FOREIGN = exports.DATA_RANGE_TYPE_STEP * 8;
exports.DATA_TYPE_HEAP_FUN = exports.DATA_RANGE_TYPE_STEP * 9;
exports.DATA_TYPE_LOCAL = exports.DATA_RANGE_TYPE_STEP * 10;
exports.DATA_TYPE_MAILBOX = exports.DATA_RANGE_TYPE_STEP * 11;
exports.DATA_TYPE_SELF = exports.DATA_RANGE_TYPE_STEP * 12;
exports.BYTE_CONSTANT_NUM = 0x10000;
exports.BYTE_CONSTANT_STR = 0x20000;
exports.BYTE_CONSTANT_INFO = 0x30000;
/**
 * StackFrame (Frame implementation).
 */
class StackFrame {
    constructor(name, script, thread, parent = (0, maybe_1.nothing)(), code = [], data = [], locals = [], ip = 0) {
        this.name = name;
        this.script = script;
        this.thread = thread;
        this.parent = parent;
        this.code = code;
        this.data = data;
        this.locals = locals;
        this.ip = ip;
    }
    getPosition() {
        return this.ip;
    }
    push(d) {
        this.data.push(d);
        return this;
    }
    pushUInt8(value) {
        return this.push((value >>> 0) & exports.DATA_MASK_VALUE8);
    }
    pushUInt16(value) {
        return this.push((value >>> 0) & exports.DATA_MASK_VALUE16);
    }
    pushUInt32(value) {
        return this.push(value >>> 0);
    }
    pushString(idx) {
        return this.push(idx | exports.DATA_TYPE_STRING);
    }
    pushName(idx) {
        return this.push(idx | exports.DATA_TYPE_INFO);
    }
    pushMessage() {
        return this.push(0 | exports.DATA_TYPE_MAILBOX);
    }
    pushSelf() {
        return this.push(exports.DATA_TYPE_SELF);
    }
    peek(n = 0) {
        return (0, maybe_1.fromNullable)(this.data.length - (n + 1));
    }
    resolve(data) {
        let { context } = this.thread;
        let typ = data & exports.DATA_MASK_TYPE;
        let value = data & exports.DATA_MASK_VALUE24;
        switch (typ) {
            case exports.DATA_TYPE_STRING:
            case exports.DATA_TYPE_HEAP_STRING:
                this.push(data);
                return this.popString();
            case exports.DATA_TYPE_HEAP_FUN:
                this.push(data);
                return this.popFunction();
            case exports.DATA_TYPE_HEAP_OBJECT:
                this.push(data);
                return this.popObject();
            case exports.DATA_TYPE_HEAP_FOREIGN:
                this.push(data);
                return this.popForeign();
            case exports.DATA_TYPE_INFO:
                this.push(data);
                return this.popName();
            //TODO: This is probably not needed.
            case exports.DATA_TYPE_LOCAL:
                let mRef = (0, maybe_1.fromNullable)(this.locals[value]);
                if (mRef.isNothing())
                    return nullErr(data);
                //TODO: review call stack safety of this recursive call.
                return this.resolve(mRef.get());
            case exports.DATA_TYPE_MAILBOX:
                if (context.mailbox.length === 0)
                    return nullErr(data);
                //messages are always accessed sequentially FIFO
                return (0, either_1.right)(context.mailbox.shift());
            case exports.DATA_TYPE_SELF:
                return (0, either_1.right)(context.address);
            //TODO: This sometimes results in us treating 0 as a legitimate
            //value whereas it should be an error. However, 0 is a valid value
            //for numbers, and booleans. Needs review, solution may be in ops
            //rather than here.
            default:
                return (0, either_1.right)(value);
        }
    }
    pop() {
        return (this.data.pop() | 0);
    }
    popValue() {
        return (this.data.length === 0) ?
            (0, either_1.left)(new error.StackEmptyErr()) :
            this.resolve(this.pop());
    }
    popString() {
        let data = this.pop();
        let typ = data & exports.DATA_MASK_TYPE;
        let idx = data & exports.DATA_MASK_VALUE24;
        if (typ === exports.DATA_TYPE_STRING) {
            let s = this.script.constants[indexes.CONSTANTS_INDEX_STRING][idx];
            if (s == null)
                return missingSymbol(data);
            return (0, either_1.right)(s);
        }
        else if (typ === exports.DATA_TYPE_HEAP_STRING) {
            return (0, either_1.right)(this.thread.vm.heap.getString(data));
        }
        else if (typ === exports.DATA_TYPE_SELF) {
            return (0, either_1.right)(this.thread.context.address);
        }
        else {
            return wrongType(exports.DATA_TYPE_STRING, typ);
        }
    }
    popName() {
        let data = this.pop();
        let typ = data & exports.DATA_MASK_TYPE;
        let idx = data & exports.DATA_MASK_VALUE24;
        if (typ === exports.DATA_TYPE_INFO) {
            let info = this.script.info[idx];
            if (info == null)
                return nullErr(data);
            return (0, either_1.right)(info);
        }
        else {
            return wrongType(exports.DATA_TYPE_INFO, data);
        }
    }
    popFunction() {
        let data = this.pop();
        let typ = data & exports.DATA_MASK_TYPE;
        if (typ === exports.DATA_TYPE_HEAP_FUN) {
            let mFun = this.thread.vm.heap.getObject(data);
            return mFun.isJust() ? (0, either_1.right)(mFun.get()) : nullFunPtr(data);
        }
        else {
            this.push(data);
            return this
                .popName()
                .chain(nfo => {
                if ((nfo.descriptor & type_1.BYTE_TYPE) !== type_1.TYPE_FUN)
                    return notAFunction(nfo.name);
                return (0, either_1.right)(nfo);
            });
        }
    }
    popObject() {
        let data = this.pop();
        let typ = data & exports.DATA_MASK_TYPE;
        if (typ === exports.DATA_TYPE_HEAP_OBJECT) {
            let mho = this.thread.vm.heap.getObject(data);
            if (mho.isNothing())
                return nullErr(data);
            return (0, either_1.right)(mho.get());
        }
        else {
            return wrongType(exports.DATA_TYPE_HEAP_OBJECT, typ);
        }
    }
    popForeign() {
        let data = this.pop();
        let typ = data & exports.DATA_MASK_TYPE;
        if (typ === exports.DATA_TYPE_HEAP_FOREIGN) {
            let mho = this.thread.vm.heap.getObject(data);
            if (mho.isNothing())
                return nullErr(data);
            return (0, either_1.right)(mho.get());
        }
        else {
            return wrongType(exports.DATA_TYPE_HEAP_FOREIGN, typ);
        }
    }
    duplicate() {
        let top = this.data.pop();
        this.data.push(top);
        this.data.push(top);
        return this;
    }
    advance() {
        this.ip = this.ip + 1;
        return this;
    }
    seek(loc) {
        this.ip = loc;
        return this;
    }
    isFinished() {
        return this.ip >= this.code.length;
    }
}
exports.StackFrame = StackFrame;
const nullErr = (data) => (0, either_1.left)(new error.NullPointerErr(data));
const wrongType = (expect, got) => (0, either_1.left)(new error.UnexpectedDataType(expect, got));
const notAFunction = (name) => (0, either_1.left)(new error.InvalidFunctionErr(name));
const nullFunPtr = (addr) => (0, either_1.left)(new error.NullFunctionPointerErr(addr));
const missingSymbol = (data) => (0, either_1.left)(new error.MissingSymbolErr(data));
//# sourceMappingURL=frame.js.map