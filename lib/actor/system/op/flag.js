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
var record_1 = require("@quenk/noni/lib/data/record");
var function_1 = require("@quenk/noni/lib/data/function");
var _1 = require("./");
/**
 * Flag instruction.
 */
var Flag = /** @class */ (function (_super) {
    __extends(Flag, _super);
    function Flag(address, flags) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.flags = flags;
        _this.code = _1.OP_FLAGS;
        _this.level = log.DEBUG;
        return _this;
    }
    Flag.prototype.exec = function (s) {
        return exports.execFlags(s, this);
    };
    return Flag;
}(_1.Op));
exports.Flag = Flag;
/**
 * execFlags
 *
 * Changes the flags of an actor by merging.
 */
exports.execFlags = function (s, _a) {
    var address = _a.address, flags = _a.flags;
    return s
        .actors
        .get(address)
        .map(function (f) {
        f.flags = record_1.merge(f.flags, flags);
    })
        .orJust(function_1.noop)
        .get();
};
//# sourceMappingURL=flag.js.map