"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var function_1 = require("@quenk/noni/lib/data/function");
var drop_1 = require("./drop");
var _1 = require("./");
/**
 * Read instruction.
 */
var Read = /** @class */ (function (_super) {
    __extends(Read, _super);
    function Read(address, envelope) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.envelope = envelope;
        _this.code = _1.OP_READ;
        _this.level = log.INFO;
        return _this;
    }
    Read.prototype.exec = function (s) {
        return exports.execRead(s, this);
    };
    return Read;
}(_1.Op));
exports.Read = Read;
/**
 * execRead
 *
 * Applies the actor behaviour in the "next tick" if a
 * receive is pending.
 */
exports.execRead = function (s, _a) {
    var address = _a.address, envelope = _a.envelope;
    return s
        .actors
        .get(address)
        .chain(consume(s, envelope))
        .orJust(function_1.noop)
        .map(function_1.noop)
        .get();
};
var consume = function (s, e) { return function (f) {
    return maybe_1.fromArray(f.behaviour)
        .map(function (_a) {
        var b = _a[0];
        return b;
    })
        .chain(function (b) {
        return b(e.message)
            .map(function () {
            if (!f.flags.immutable)
                f.behaviour.shift();
        })
            .orRight(function () {
            s.exec(new drop_1.Drop(e.to, e.from, e.message));
        })
            .toMaybe();
    });
}; };
//# sourceMappingURL=read.js.map