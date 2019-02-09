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
exports.TYPE_FOREIGN = 0x5;
//Storage locations.
exports.LOCATION_LITERAL = 0x0;
exports.LOCATION_CONSTANTS = 0x1;
exports.LOCATION_HEAP = 0x2;
exports.LOCATION_LOCAL = 0x3;
exports.LOCATION_MAILBOX = 0x4;
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
    Type[Type["Foreign"] = exports.TYPE_FOREIGN] = "Foreign";
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
    Location[Location["Mailbox"] = exports.LOCATION_MAILBOX] = "Mailbox";
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
    function Frame(actor, context, script, code, data, locals, heap, ip) {
        if (code === void 0) { code = []; }
        if (data === void 0) { data = []; }
        if (locals === void 0) { locals = []; }
        if (heap === void 0) { heap = []; }
        if (ip === void 0) { ip = 0; }
        this.actor = actor;
        this.context = context;
        this.script = script;
        this.code = code;
        this.data = data;
        this.locals = locals;
        this.heap = heap;
        this.ip = ip;
    }
    /**
     * seek advances the Frame's ip to the location specified.
     *
     * Generates an error if the seek is out of the code block's bounds.
     */
    Frame.prototype.seek = function (location) {
        if ((location < 0) || (location >= (this.code.length)))
            return either_1.left(new error.JumpOutOfBoundsErr(location, this.code.length - 1));
        this.ip = location;
        return either_1.right(this);
    };
    /**
     * allocate space on the heap for a value.
     */
    Frame.prototype.allocate = function (value, typ) {
        this.heap.push(value);
        return [this.heap.length - 1, typ, Location.Heap];
    };
    /**
     * allocateTemplate
     */
    Frame.prototype.allocateTemplate = function (t) {
        return this.allocate(t, Type.Template);
    };
    /**
     * push onto the stack an Operand, indicating its type and storage location.
     */
    Frame.prototype.push = function (value, type, location) {
        this.data.push(location);
        this.data.push(type);
        this.data.push(value);
        return this;
    };
    /**
     * pushNumber onto the stack.
     */
    Frame.prototype.pushNumber = function (n) {
        this.push(n, Type.Number, Location.Literal);
        return this;
    };
    /**
     * pushAddress onto the stack.
     *
     * (Value is stored on the heap)
     */
    Frame.prototype.pushAddress = function (addr) {
        this.heap.push(addr);
        this.push(this.heap.length - 1, Type.String, Location.Heap);
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
        ];
    };
    Frame.prototype.peek = function (n) {
        if (n === void 0) { n = 0; }
        var len = this.data.length;
        var offset = n * 3;
        return [
            this.data[len - (1 + offset)],
            this.data[len - (2 + offset)],
            this.data[len - (3 + offset)]
        ];
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
                    .orJust(nullErr)
                    .get();
            case Location.Heap:
                return maybe_1.fromNullable(this.heap[data[Field.Value]])
                    .map(function (v) { return either_1.right(v); })
                    .orJust(nullErr)
                    .get();
            case Location.Mailbox:
                return this
                    .context
                    .mailbox
                    .chain(function (m) { return maybe_1.fromNullable(m[data[Field.Value]]); })
                    .map(function (v) { return either_1.right(v); })
                    .get();
            default:
                return nullErr();
        }
    };
    /**
     * resolveNumber
     */
    Frame.prototype.resolveNumber = function (data) {
        if (data[Field.Type] !== Type.Number)
            return either_1.left(new error.TypeErr(Type.Number, data[Field.Type]));
        return this.resolve(data);
    };
    /**
     * resolveAddress
     */
    Frame.prototype.resolveAddress = function (data) {
        if (data[Field.Type] !== Type.String)
            return either_1.left(new error.TypeErr(Type.String, data[Field.Type]));
        return this.resolve(data);
    };
    /**
     * resolveFunction
     */
    Frame.prototype.resolveFunction = function (data) {
        if (data[Field.Type] !== Type.Function)
            return either_1.left(new error.TypeErr(Type.Function, data[Field.Type]));
        return this.resolve(data);
    };
    /**
     * resolveTemplate
     */
    Frame.prototype.resolveTemplate = function (data) {
        if (data[Field.Type] !== Type.Template)
            return either_1.left(new error.TypeErr(Type.Template, data[Field.Type]));
        return this.resolve(data);
    };
    /**
     * resolveMessage
     */
    Frame.prototype.resolveMessage = function (data) {
        if (data[Field.Type] !== Type.Message)
            return either_1.left(new error.TypeErr(Type.Message, data[Field.Type]));
        return this.resolve(data);
    };
    /**
     * resolveForeign
     */
    Frame.prototype.resolveForeign = function (data) {
        if (data[Field.Type] !== Type.Foreign)
            return either_1.left(new error.TypeErr(Type.Foreign, data[Field.Type]));
        return this.resolve(data);
    };
    return Frame;
}());
exports.Frame = Frame;
//# sourceMappingURL=frame.js.map