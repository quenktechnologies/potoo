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
        this.name = '<spawn>';
        this.constants = [[], []];
        this.immediate = true;
        this.info = [
            new info_1.ForeignFunInfo('getTemp', 0, info_1.TYPE_TEMPLATE, false, function () { return _this.template; })
        ];
        this.code = [
            op.LDN | 0,
            op.CALL,
            op.SELF,
            op.ALLOC,
            op.DUP,
            op.RUN
        ];
    }
    return Spawn;
}());
exports.Spawn = Spawn;
/**
 * Self provides the address of the current instance.
 */
var Self = /** @class */ (function () {
    function Self() {
        this.constants = [[], []];
        this.name = '<self>';
        this.immediate = true;
        this.info = [];
        this.code = [
            op.SELF
        ];
    }
    return Self;
}());
exports.Self = Self;
/**
 * Tell used to deliver messages to other actors.
 */
var Tell = /** @class */ (function () {
    function Tell(to, msg) {
        var _this = this;
        this.to = to;
        this.msg = msg;
        this.constants = [[], []];
        this.name = '<tell>';
        this.info = [
            new info_1.ForeignFunInfo('getAddress', 0, info_1.TYPE_OBJECT, false, function () { return _this.to; }),
            new info_1.ForeignFunInfo('getMessage', 0, info_1.TYPE_OBJECT, false, function () { return _this.msg; })
        ];
        this.code = [
            op.LDN | 0,
            op.CALL,
            op.LDN | 1,
            op.CALL,
            op.SEND
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
        this.f = f;
        this.constants = [[], []];
        this.name = 'receive';
        this.info = [
            new info_1.ForeignFunInfo('receiver', 0, info_1.TYPE_VOID, false, this.f),
        ];
        this.code = [
            op.LDN | 0,
            op.RECV
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
        this.name = '<notify>';
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
/**
 * Raise an exception triggering the systems error handling mechanism.
 * TODO: implement
 */
var Raise = /** @class */ (function () {
    function Raise(msg) {
        var _this = this;
        this.msg = msg;
        this.name = '<raise>';
        this.constants = [[], []];
        this.info = [
            new info_1.ForeignFunInfo('getMessage', 0, info_1.TYPE_STRING, false, function () { return _this.msg; })
        ];
        this.code = [
            op.LDN | 0,
            op.CALL,
            op.RAISE
        ];
    }
    return Raise;
}());
exports.Raise = Raise;
/**
 * Kill stops an actor within the executing actor's process tree (inclusive).
 * TODO: implement.
 */
var Kill = /** @class */ (function () {
    function Kill(addr) {
        var _this = this;
        this.addr = addr;
        this.name = '<kill>';
        this.constants = [[], []];
        this.info = [
            new info_1.ForeignFunInfo('getAddress', 0, info_1.TYPE_STRING, false, function () { return _this.addr; })
        ];
        this.code = [
            op.LDN | 0,
            op.CALL,
            op.STOP
        ];
    }
    return Kill;
}());
exports.Kill = Kill;
//# sourceMappingURL=scripts.js.map