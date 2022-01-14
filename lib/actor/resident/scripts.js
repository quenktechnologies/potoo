"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskActorScript = exports.MutableActorScript = exports.CallbackActorScript = exports.ImmutableActorScript = exports.GenericResidentScript = void 0;
var op = require("../system/vm/runtime/op");
var events = require("../system/vm/event");
var errors = require("../system/vm/runtime/error");
var array_1 = require("@quenk/noni/lib/data/array");
var info_1 = require("../system/vm/script/info");
var scripts_1 = require("../system/vm/scripts");
// XXX: This needs to be updated when new functions are added to 
// residentCommonFunctions.
var receiveIdx = scripts_1.commonFunctions.length + 2;
var residentCommonFunctions = __spreadArrays(scripts_1.commonFunctions, [
    new info_1.NewFunInfo('notify', 0, [
        op.MAILCOUNT,
        op.IFZJMP | 5,
        op.MAILDQ,
        op.LDN | receiveIdx,
        op.CALL | 1,
        op.NOP // End
    ]),
    new info_1.NewForeignFunInfo('kill', 1, function (thr, addr) {
        thr.wait(thr.vm.kill(thr.context.actor, addr));
        return 0;
    })
]);
/**
 * GenericResidentScript used by resident actors not declared here.
 */
var GenericResidentScript = /** @class */ (function (_super) {
    __extends(GenericResidentScript, _super);
    function GenericResidentScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.info = residentCommonFunctions;
        return _this;
    }
    return GenericResidentScript;
}(scripts_1.BaseScript));
exports.GenericResidentScript = GenericResidentScript;
/**
 * ImmutableActorScript used by Immutable actor instances.
 */
var ImmutableActorScript = /** @class */ (function (_super) {
    __extends(ImmutableActorScript, _super);
    function ImmutableActorScript(actor) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.info = __spreadArrays(residentCommonFunctions, [
            new info_1.NewForeignFunInfo('receive', 1, function (thr, msg) {
                return immutableExec(_this.actor, thr, msg);
            })
        ]);
        _this.code = [];
        return _this;
    }
    return ImmutableActorScript;
}(scripts_1.BaseScript));
exports.ImmutableActorScript = ImmutableActorScript;
/**
 * CallbackActorScript used by Callback actor instances.
 */
var CallbackActorScript = /** @class */ (function (_super) {
    __extends(CallbackActorScript, _super);
    function CallbackActorScript(actor) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.info = __spreadArrays(residentCommonFunctions, [
            new info_1.NewForeignFunInfo('receive', 1, function (thr, msg) {
                var result = immutableExec(_this.actor, thr, msg);
                _this.actor.exit();
                return result;
            })
        ]);
        _this.code = [];
        return _this;
    }
    return CallbackActorScript;
}(scripts_1.BaseScript));
exports.CallbackActorScript = CallbackActorScript;
/**
 * MutableActorScript used by Mutable actor instances.
 */
var MutableActorScript = /** @class */ (function (_super) {
    __extends(MutableActorScript, _super);
    function MutableActorScript(actor) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.info = __spreadArrays(residentCommonFunctions, [
            new info_1.NewForeignFunInfo('receive', 1, function (thr, msg) {
                var actor = _this.actor;
                var vm = actor.system.getPlatform();
                if (array_1.empty(actor.$receivers)) {
                    thr.raise(new errors.NoReceiverErr(thr.context.address));
                    return 0;
                }
                if (actor.$receivers[0].test(msg)) {
                    var receiver = actor.$receivers.shift();
                    var future = receiver.apply(msg);
                    if (future)
                        thr.wait(future);
                    vm.trigger(thr.context.address, events.EVENT_MESSAGE_READ, msg);
                    return 1;
                }
                else {
                    vm.trigger(thr.context.address, events.EVENT_MESSAGE_DROPPED, msg);
                    return 0;
                }
            }),
            new info_1.NewFunInfo('notify', 0, [
                op.MAILCOUNT,
                op.IFZJMP | 4,
                op.MAILDQ,
                // Apply the handler for messages once.
                op.CALL | residentCommonFunctions.length + 1,
                op.NOP // End
            ]),
        ]);
        _this.code = [];
        return _this;
    }
    return MutableActorScript;
}(scripts_1.BaseScript));
exports.MutableActorScript = MutableActorScript;
/**
 * TaskActorScript used by the Task actor.
 */
var TaskActorScript = /** @class */ (function (_super) {
    __extends(TaskActorScript, _super);
    function TaskActorScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.info = scripts_1.commonFunctions;
        return _this;
    }
    return TaskActorScript;
}(scripts_1.BaseScript));
exports.TaskActorScript = TaskActorScript;
var immutableExec = function (actor, thr, msg) {
    var vm = actor.system.getPlatform();
    if (actor.$receiver.test(msg)) {
        var future = actor.$receiver.apply(msg);
        if (future)
            thr.wait(future);
        vm.trigger(thr.context.address, events.EVENT_MESSAGE_READ, msg);
        return 1;
    }
    else {
        vm.trigger(thr.context.address, events.EVENT_MESSAGE_DROPPED, msg);
        return 0;
    }
};
//# sourceMappingURL=scripts.js.map