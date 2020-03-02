"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var indexes = require("../../script");
var error = require("../error");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
exports.DATA_RANGE_TYPE_HIGH = 0x7F000000;
exports.DATA_RANGE_TYPE_LOW = 0x1000000;
exports.DATA_RANGE_TYPE_STEP = 0x1000000;
exports.DATA_RANGE_LOCATION_HIGH = 0xFF0000;
exports.DATA_RANGE_LOCATION_LOW = 0x10000;
exports.DATA_RANGE_LOCATION_STEP = 0x10000;
exports.DATA_RANGE_VALUE_HIGH = 0xFFFF;
exports.DATA_RANGE_VALUE_LOW = 0x0;
// Used to extract the desired part via &
exports.DATA_MASK_TYPE = 0xFF000000;
exports.DATA_MASK_LOCATION = 0xFF0000;
exports.DATA_MASK_VALUE8 = 0xFF;
exports.DATA_MASK_VALUE16 = 0xFFFF;
exports.DATA_MAX_SIZE = 0x7FFFFFFF;
//Type indicators.
exports.DATA_TYPE_UINT8 = exports.DATA_RANGE_TYPE_STEP;
exports.DATA_TYPE_UINT16 = exports.DATA_RANGE_TYPE_STEP * 2;
exports.DATA_TYPE_FLOAT64 = exports.DATA_RANGE_TYPE_STEP * 10;
exports.DATA_TYPE_STRING = exports.DATA_RANGE_TYPE_STEP * 15;
exports.DATA_TYPE_ADDRESS = exports.DATA_TYPE_STRING;
exports.DATA_TYPE_TEMPLATE = exports.DATA_RANGE_TYPE_STEP * 20;
exports.DATA_TYPE_MESSAGE = exports.DATA_RANGE_TYPE_STEP * 25;
//Storage location indicators.
exports.DATA_LOCATION_IMMEDIATE = exports.DATA_RANGE_LOCATION_STEP;
exports.DATA_LOCATION_CONSTANTS = exports.DATA_RANGE_LOCATION_STEP * 2;
exports.DATA_LOCATION_LOCALS = exports.DATA_RANGE_LOCATION_STEP * 3;
exports.DATA_LOCATION_HEAP = exports.DATA_RANGE_LOCATION_STEP * 4;
exports.DATA_LOCATION_MAILBOX = exports.DATA_RANGE_LOCATION_STEP * 5;
/**
 * DataType enum.
 */
var DataType;
(function (DataType) {
    DataType[DataType["UInt8"] = exports.DATA_TYPE_UINT8] = "UInt8";
    DataType[DataType["UInt16"] = exports.DATA_TYPE_UINT16] = "UInt16";
    DataType[DataType["Float64"] = exports.DATA_TYPE_FLOAT64] = "Float64";
    DataType[DataType["String"] = exports.DATA_TYPE_STRING] = "String";
    DataType[DataType["Address"] = exports.DATA_TYPE_ADDRESS] = "Address";
    DataType[DataType["Template"] = exports.DATA_TYPE_TEMPLATE] = "Template";
    DataType[DataType["Message"] = exports.DATA_TYPE_MESSAGE] = "Message";
})(DataType = exports.DataType || (exports.DataType = {}));
/**
 * Location enum.
 */
var Location;
(function (Location) {
    Location[Location["Immediate"] = exports.DATA_LOCATION_IMMEDIATE] = "Immediate";
    Location[Location["Constants"] = exports.DATA_LOCATION_CONSTANTS] = "Constants";
    Location[Location["Heap"] = exports.DATA_LOCATION_HEAP] = "Heap";
    Location[Location["Local"] = exports.DATA_LOCATION_LOCALS] = "Local";
    Location[Location["Mailbox"] = exports.DATA_LOCATION_MAILBOX] = "Mailbox";
})(Location = exports.Location || (exports.Location = {}));
/**
 * typeMaps maps a type to its index in the contants pool.
 */
exports.typeMaps = (_a = {},
    _a[exports.DATA_TYPE_FLOAT64] = indexes.PVM_TYPE_INDEX_FLOAT64,
    _a[exports.DATA_TYPE_STRING] = indexes.PVM_TYPE_INDEX_STRING,
    _a[exports.DATA_TYPE_ADDRESS] = indexes.PVM_TYPE_INDEX_ADDRESS,
    _a[exports.DATA_TYPE_TEMPLATE] = indexes.PVM_TYPE_INDEX_TEMPLATE,
    _a[exports.DATA_TYPE_MESSAGE] = indexes.PVM_TYPE_INDEX_MESSAGE,
    _a);
/**
 * Frame is the context for currently executing op codes.
 *
 * It provides methods for manipulating the stack common to each op code as
 * well as access to other components of the system.
 */
var Frame = /** @class */ (function () {
    function Frame(actor, context, script, code, data, locals, ip) {
        if (code === void 0) { code = []; }
        if (data === void 0) { data = []; }
        if (locals === void 0) { locals = []; }
        if (ip === void 0) { ip = 0; }
        this.actor = actor;
        this.context = context;
        this.script = script;
        this.code = code;
        this.data = data;
        this.locals = locals;
        this.ip = ip;
    }
    /**
     * push a value onto the data stack.
     *
     * Care should be taken when using this method to ensure the value has
     * the correct bits set.
     */
    Frame.prototype.push = function (d) {
        this.data.push(d);
        return this;
    };
    /**
     * pushUInt8 pushes an unsigned 8bit integer onto the data stack.
     */
    Frame.prototype.pushUInt8 = function (value) {
        this.push(value &
            exports.DATA_MASK_VALUE8 |
            exports.DATA_LOCATION_IMMEDIATE |
            exports.DATA_TYPE_UINT8);
        return this;
    };
    /**
     * pushUInt16 pushes an unsigned 16bit integer onto the data stack.
     */
    Frame.prototype.pushUInt16 = function (value) {
        this.push(value &
            exports.DATA_MASK_VALUE8 |
            exports.DATA_LOCATION_IMMEDIATE |
            exports.DATA_TYPE_UINT16);
        return this;
    };
    /**
     * pushString from the constant pool onto the data stack.
     */
    Frame.prototype.pushString = function (idx) {
        this.push(idx | exports.DATA_LOCATION_CONSTANTS | exports.DATA_TYPE_STRING);
        return this;
    };
    /**
     * pushTemplate from the constant pool onto the data stack.
     */
    Frame.prototype.pushTemplate = function (idx) {
        this.push(idx | exports.DATA_LOCATION_CONSTANTS | exports.DATA_TYPE_TEMPLATE);
        return this;
    };
    /**
     * resolve a value from it's location, producing
     * an error if it can not be found.
     */
    Frame.prototype.resolve = function (data) {
        var _a = this, script = _a.script, context = _a.context;
        var typ = data & exports.DATA_MASK_TYPE;
        var location = data & exports.DATA_MASK_LOCATION;
        var value = data & exports.DATA_MASK_VALUE16;
        switch (location) {
            case exports.DATA_LOCATION_IMMEDIATE:
                return either_1.right(value);
            case exports.DATA_LOCATION_CONSTANTS:
                var mTypes = maybe_1.fromNullable(script.constants[exports.typeMaps[typ]]);
                if (mTypes.isNothing())
                    return nullErr(data);
                var types = mTypes.get();
                var mVal = maybe_1.fromNullable(types[value]);
                if (mVal.isNothing())
                    return nullErr(data);
                return either_1.right(mVal.get());
            case exports.DATA_LOCATION_LOCALS:
                var mRef = maybe_1.fromNullable(this.locals[value]);
                if (mRef.isNothing())
                    return nullErr(data);
                //TODO: review call stack safety of this recursive call.
                return this.resolve(mRef.get());
            case Location.Mailbox:
                if (context.mailbox.isNothing())
                    return nullErr(data);
                var mailbox = context.mailbox.get();
                var mMsg = maybe_1.fromNullable(mailbox[value]);
                if (mMsg.isNothing())
                    return nullErr(data);
                return either_1.right(mMsg.get());
            default:
                return nullErr(data);
        }
    };
    /**
     * pop the top most value from the data stack.
     */
    Frame.prototype.pop = function () {
        return this.data.pop();
    };
    /**
     * popValue pops and attempts to resolve the top most value of the data stack.
     */
    Frame.prototype.popValue = function () {
        return this.resolve(this.pop());
    };
    /**
     *  popString from the top of the data stack.
     */
    Frame.prototype.popString = function () {
        return this.popValue();
    };
    /**
     * popTemplate from the top of the data stack.
     */
    Frame.prototype.popTemplate = function () {
        return this.popValue();
    };
    return Frame;
}());
exports.Frame = Frame;
var nullErr = function (data) {
    return either_1.left(new error.NullPointerErr(data));
};
//# sourceMappingURL=frame.js.map