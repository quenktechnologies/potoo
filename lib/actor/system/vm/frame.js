"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("./error");
var either_1 = require("@quenk/noni/lib/data/either");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
//Type indicators.
exports.TYPE_NUMBER = 0x0;
exports.TYPE_STRING = 0x1;
exports.TYPE_FUNCTION = 0x2;
exports.TYPE_TEMPLATE = 0x3;
exports.TYPE_MESSAGE = 0x4;
//Storage locations.
exports.LOCATION_LITERAL = 0x0;
exports.LOCATION_CONSTANTS = 0x1;
exports.LOCATION_HEAP = 0x2;
exports.LOCATION_LOCAL = 0x3;
/**
 * Type indicates the type of an Operand.
 *
 * One of TYPE_* constants.
 */
var Type;
(function (Type) {
    Type[Type["Number"] = exports.TYPE_NUMBER] = "Number";
    Type[Type["String"] = exports.TYPE_STRING] = "String";
    Type[Type["Function"] = exports.TYPE_FUNCTION] = "Function";
    Type[Type["Template"] = exports.TYPE_TEMPLATE] = "Template";
    Type[Type["Message"] = exports.TYPE_MESSAGE] = "Message";
})(Type = exports.Type || (exports.Type = {}));
/**
 * Location indicates where the value is stored.
 */
var Location;
(function (Location) {
    Location[Location["Literal"] = exports.LOCATION_LITERAL] = "Literal";
    Location[Location["Constants"] = exports.LOCATION_CONSTANTS] = "Constants";
    Location[Location["Heap"] = exports.LOCATION_HEAP] = "Heap";
    Location[Location["Local"] = exports.LOCATION_LOCAL] = "Local";
})(Location = exports.Location || (exports.Location = {}));
/**
 * Field
 */
var Field;
(function (Field) {
    Field[Field["Value"] = 0] = "Value";
    Field[Field["Type"] = 1] = "Type";
    Field[Field["Location"] = 2] = "Location";
})(Field = exports.Field || (exports.Field = {}));
/**
 * Frame of execution.
 */
var Frame = /** @class */ (function () {
    function Frame(script, context, code, data, locals, heap, ip) {
        if (code === void 0) { code = []; }
        if (data === void 0) { data = []; }
        if (locals === void 0) { locals = []; }
        if (heap === void 0) { heap = []; }
        if (ip === void 0) { ip = 0; }
        this.script = script;
        this.context = context;
        this.code = code;
        this.data = data;
        this.locals = locals;
        this.heap = heap;
        this.ip = ip;
    }
    /**
     * push onto the stack an Operand, indicating its type and storage location.
     */
    Frame.prototype.push = function (value, type, location) {
        this.data.push(value, type, location);
        return this;
    };
    /**
     * pop an operand off the stack.
     */
    Frame.prototype.pop = function () {
        return [
            this.data.pop(),
            this.data.pop(),
            this.data.pop()
        ].reverse();
    };
    /**
     * resolve a value from it's location, producing
     * an error if it can not be found.
     */
    Frame.prototype.resolve = function (data) {
        var _this = this;
        var nullErr = function () { return either_1.left(new error.NullPointerErr(data)); };
        switch (data[Field.Location]) {
            case Location.Literal:
                return either_1.right(data[Field.Value]);
            case Location.Constants:
                return maybe_1.fromNullable(this.script.constants[data[Field.Type]])
                    .chain(function (typ) { return maybe_1.fromNullable(typ[data[Field.Value]]); })
                    .map(function (v) { return either_1.right(v); })
                    .orJust(nullErr)
                    .get();
            case Location.Local:
                return maybe_1.fromNullable(this.locals[data[Field.Value]])
                    .map(function (d) { return _this.resolve(d); })
                    .get();
            case Location.Heap:
                return maybe_1.fromNullable(this.heap[data[Field.Value]])
                    .map(function (v) { return either_1.right(v); })
                    .orJust(nullErr)
                    .get();
            default:
                return nullErr();
        }
    };
    return Frame;
}());
exports.Frame = Frame;
//# sourceMappingURL=frame.js.map