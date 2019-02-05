"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var either_1 = require("@quenk/noni/lib/data/either");
var frame_1 = require("../frame");
var _1 = require("./");
/**
 * Jump to a new location.
 */
var Jump = /** @class */ (function () {
    function Jump(location) {
        this.location = location;
        this.code = _1.OP_CODE_JUMP;
        this.level = _1.Level.Base;
    }
    Jump.prototype.exec = function (e) {
        var curr = e.current().get();
        curr
            .seek(this.location)
            .lmap(function (err) { return e.raise(err); });
    };
    Jump.prototype.toLog = function () {
        return ['jump', [this.location, frame_1.Type.Number, frame_1.Location.Literal], []];
    };
    return Jump;
}());
exports.Jump = Jump;
/**
 * JumpIfOne changes the current Frame's ip if the top value is one.
 *
 * Pops
 * 1. value to test.
 */
var JumpIfOne = /** @class */ (function () {
    function JumpIfOne(location) {
        this.location = location;
        this.code = _1.OP_CODE_JUMP_IF_ONE;
        this.level = _1.Level.Base;
    }
    JumpIfOne.prototype.exec = function (e) {
        var _this = this;
        var curr = e.current().get();
        curr
            .resolveNumber(curr.pop())
            .chain(function (n) {
            if (n === 1)
                return curr.seek(_this.location);
            return either_1.right(curr);
        })
            .lmap(function (err) { return e.raise(err); });
    };
    JumpIfOne.prototype.toLog = function (f) {
        return ['jumpifone', [this.location, frame_1.Type.Number, frame_1.Location.Literal],
            [f.peek()]];
    };
    return JumpIfOne;
}());
exports.JumpIfOne = JumpIfOne;
//# sourceMappingURL=jump.js.map