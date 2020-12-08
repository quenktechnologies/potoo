"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kill = exports.Raise = exports.Notify = exports.Receive = exports.Tell = exports.Self = exports.Spawn = void 0;
var op = require("../system/vm/runtime/op");
var type_1 = require("@quenk/noni/lib/data/type");
var info_1 = require("../system/vm/script/info");
var es_1 = require("../system/vm/runtime/heap/object/es");
//XXX: The following is declared here because we need the children section to
//be recursive. In the future we may support lazily getting properties by 
//using functions or some other mechanism.
var templateType = new info_1.NewTypeInfo('Template', 0, []);
var childrenInfo = new info_1.NewArrayTypeInfo('Children', templateType);
templateType.properties[0] = { name: 'children', type: childrenInfo };
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
            templateType,
            new info_1.NewForeignFunInfo('getTemp', 0, function (r) { return r.heap.addObject(new es_1.ESObject(r.heap, templateType, _this.template)); }),
            new info_1.NewFunInfo('spawn', 2, [
                op.STORE | 0,
                op.STORE | 1,
                op.LOAD | 1,
                op.LOAD | 0,
                op.ALLOC,
                op.STORE | 2,
                op.LOAD | 2,
                op.RUN,
                op.LOAD | 0,
                op.GETPROP | 0,
                op.DUP,
                op.IFZJMP | 32,
                op.STORE | 3,
                op.LOAD | 3,
                op.ARLENGTH,
                op.STORE | 4,
                op.PUSHUI32 | 0,
                op.STORE | 5,
                op.LOAD | 4,
                op.LOAD | 5,
                op.CEQ,
                op.IFNZJMP | 34,
                op.PUSHUI32 | 0,
                op.LOAD | 5,
                op.LOAD | 3,
                op.ARELM,
                op.LOAD | 2,
                op.LDN | 2,
                op.CALL,
                op.LOAD | 5,
                op.PUSHUI32 | 1,
                op.ADDUI32,
                op.STORE | 5,
                op.JMP | 18,
                op.LOAD | 2 //34: Load the address of the first spawned.
            ])
        ];
        this.code = [
            op.LDN | 1,
            op.CALL,
            op.SELF,
            op.LDN | 2,
            op.CALL // 4: Call spawn, with parent and template.
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
            new info_1.NewForeignFunInfo('getAddress', 0, function () { return _this.to; }),
            new info_1.NewForeignFunInfo('getMessage', 0, function (r) { return type_1.isObject(_this.msg) ?
                r.heap.addObject(new es_1.ESObject(r.heap, info_1.objectType, _this.msg)) :
                _this.msg; })
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
            this.f
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
            new info_1.NewForeignFunInfo('getMessage', 0, function () { return _this.msg; })
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
            new info_1.NewForeignFunInfo('getAddress', 0, function () { return _this.addr; })
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