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
Object.defineProperty(exports, "__esModule", { value: true });
var push_1 = require("../system/vm/op/push");
var tell_1 = require("../system/vm/op/tell");
var drop_1 = require("../system/vm/op/drop");
var discard_1 = require("../system/vm/op/discard");
var jump_1 = require("../system/vm/op/jump");
var noop_1 = require("../system/vm/op/noop");
var receive_1 = require("../system/vm/op/receive");
var read_1 = require("../system/vm/op/read");
var raise_1 = require("../system/vm/op/raise");
var script_1 = require("../system/vm/script");
var acceptCode = [
    new push_1.PushMsg(0),
    new drop_1.Drop()
];
var tellcode = [
    new push_1.PushMsg(0),
    new push_1.PushStr(0),
    new tell_1.Tell(),
    new jump_1.JumpIfOne(6),
    new push_1.PushMsg(0),
    new drop_1.Drop(),
    new noop_1.Noop() //6: Do nothing.
];
var receivecode = [
    new push_1.PushForeign(0),
    new receive_1.Receive()
];
var notifyCode = [
    new read_1.Read(),
    new jump_1.JumpIfOne(3),
    new discard_1.Discard(),
    new noop_1.Noop()
];
var raiseCode = [
    new push_1.PushMsg(0),
    new raise_1.Raise(),
];
/**
 * AcceptScript for discarding messages.
 */
var AcceptScript = /** @class */ (function (_super) {
    __extends(AcceptScript, _super);
    function AcceptScript(msg) {
        var _this = _super.call(this, [[], [], [], [], [msg], []], acceptCode) || this;
        _this.msg = msg;
        return _this;
    }
    return AcceptScript;
}(script_1.Script));
exports.AcceptScript = AcceptScript;
exports.DropScript = AcceptScript;
/**
 * TellScript for sending messages.
 */
var TellScript = /** @class */ (function (_super) {
    __extends(TellScript, _super);
    function TellScript(to, msg) {
        var _this = _super.call(this, [[], [to], [], [], [msg], []], tellcode) || this;
        _this.to = to;
        _this.msg = msg;
        return _this;
    }
    return TellScript;
}(script_1.Script));
exports.TellScript = TellScript;
/**
 * ReceiveScript
 */
var ReceiveScript = /** @class */ (function (_super) {
    __extends(ReceiveScript, _super);
    function ReceiveScript(func) {
        var _this = _super.call(this, [[], [], [], [], [], [func]], receivecode) || this;
        _this.func = func;
        return _this;
    }
    return ReceiveScript;
}(script_1.Script));
exports.ReceiveScript = ReceiveScript;
/**
 * NotifyScript
 */
var NotifyScript = /** @class */ (function (_super) {
    __extends(NotifyScript, _super);
    function NotifyScript() {
        return _super.call(this, [[], [], [], [], [], []], notifyCode) || this;
    }
    return NotifyScript;
}(script_1.Script));
exports.NotifyScript = NotifyScript;
/**
 * RaiseScript
 */
var RaiseScript = /** @class */ (function (_super) {
    __extends(RaiseScript, _super);
    function RaiseScript(msg) {
        var _this = _super.call(this, [[], [], [], [], [msg], []], raiseCode) || this;
        _this.msg = msg;
        return _this;
    }
    return RaiseScript;
}(script_1.Script));
exports.RaiseScript = RaiseScript;
//# sourceMappingURL=scripts.js.map