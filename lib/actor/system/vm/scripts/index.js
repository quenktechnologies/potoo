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
exports.VMActorScript = exports.NoScript = exports.BaseScript = exports.commonFunctions = void 0;
var op = require("../runtime/op");
var info_1 = require("../script/info");
/**
 * commonFunctions used by both the VM script and the resident ones.
 */
exports.commonFunctions = [
    // $0: Message 1: Address
    new info_1.NewFunInfo('tell', 2, [op.SEND])
];
/**
 * BaseScript providing sane defaults for all our Script instances.
 */
var BaseScript = /** @class */ (function () {
    function BaseScript() {
        this.constants = [[], []];
        this.name = '<main>';
        this.info = [];
        this.code = [];
    }
    return BaseScript;
}());
exports.BaseScript = BaseScript;
/**
 * NoScript is used for actors that do not execute any code.
 */
var NoScript = /** @class */ (function (_super) {
    __extends(NoScript, _super);
    function NoScript() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoScript;
}(BaseScript));
exports.NoScript = NoScript;
/**
 * VMActorScript is the script used by the VM for its own actor (the $ actor).
 *
 * This script provides VM functions for:
 * 1. Sending messages
 * 2. Retrieving messages.
 * 3. Killing other actors.
 * 4. Racing exceptions.
 */
var VMActorScript = /** @class */ (function (_super) {
    __extends(VMActorScript, _super);
    function VMActorScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.info = __spreadArrays(exports.commonFunctions);
        return _this;
    }
    return VMActorScript;
}(BaseScript));
exports.VMActorScript = VMActorScript;
//# sourceMappingURL=index.js.map