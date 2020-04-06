"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var op = require("../system/vm/runtime/op");
var info_1 = require("../system/vm/script/info");
/**
 * Spawn spawns a single child actor from a template.
 */
var Spawn = /** @class */ (function () {
    function Spawn(template) {
        var _this = this;
        this.template = template;
        this.constants = [[], []];
        this.info = [
            new info_1.ForeignFunInfo('getTemp', 0, info_1.TYPE_TEMPLATE, false, function () { return _this.template; })
        ];
        this.code = [
            op.SELF,
            op.CALL | 1,
            op.ALLOC,
            op.DUP,
            op.RUN
        ];
    }
    return Spawn;
}());
exports.Spawn = Spawn;
/**
 * Tell used to deliver messages to other actors.
 */
var Tell = /** @class */ (function () {
    function Tell(to, msg) {
        var _this = this;
        this.to = to;
        this.msg = msg;
        this.constants = [[], []];
        this.info = [
            new info_1.ForeignFunInfo('getAddress', 0, info_1.TYPE_OBJECT, false, function () { return _this.to; }),
            new info_1.ForeignFunInfo('getMessage', 0, info_1.TYPE_OBJECT, false, function () { return _this.msg; })
        ];
        this.code = [
            op.CALL | 0,
            op.CALL | 1,
            op.ALLOC
        ];
    }
    return Tell;
}());
exports.Tell = Tell;
/**
 * Receive schedules a receiver for the actor.
 */
var Receive = /** @class */ (function () {
    function Receive(f) {
        var _this = this;
        this.f = f;
        this.constants = [[], []];
        this.info = [
            new info_1.ForeignFunInfo('getAddress', 0, info_1.TYPE_OBJECT, false, function () { return _this.f; }),
        ];
        this.code = [
            op.RECV | 0,
        ];
    }
    return Receive;
}());
exports.Receive = Receive;
/**
 * Notify attempts to consume the next available message in the mailbox.
 */
var Notify = /** @class */ (function () {
    function Notify() {
        this.constants = [[], []];
        this.info = [];
        this.code = [
            op.MAILCOUNT,
            op.IFZJMP | 6,
            op.RECVCOUNT,
            op.IFZJMP | 6,
            op.MAILDQ,
            op.READ,
            op.NOP //End
        ];
    }
    return Notify;
}());
exports.Notify = Notify;
//# sourceMappingURL=scripts.js.map