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
var push_1 = require("../op/push");
var stop_1 = require("../op/stop");
var restart_1 = require("../op/restart");
var run_1 = require("../op/run");
var script_1 = require("../script");
var restartCode = [
    new restart_1.Restart(),
    new run_1.Run()
];
var stopCode = [
    new push_1.PushStr(0),
    new stop_1.Stop()
];
/**
 * StopScript for stopping actors.
 */
var StopScript = /** @class */ (function (_super) {
    __extends(StopScript, _super);
    function StopScript(addr) {
        var _this = _super.call(this, [[], [addr], [], [], [], []], stopCode) || this;
        _this.addr = addr;
        return _this;
    }
    return StopScript;
}(script_1.Script));
exports.StopScript = StopScript;
/**
 * RestartScript for restarting actors.
 */
var RestartScript = /** @class */ (function (_super) {
    __extends(RestartScript, _super);
    function RestartScript() {
        return _super.call(this, [[], [], [], [], [], []], restartCode) || this;
    }
    return RestartScript;
}(script_1.Script));
exports.RestartScript = RestartScript;
//# sourceMappingURL=scripts.js.map