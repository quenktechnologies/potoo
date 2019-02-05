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
var script_1 = require("../system/vm/script");
var push_1 = require("../system/vm/op/push");
var raise_1 = require("../system/vm/op/raise");
var raiseCode = [
    new push_1.PushStr(0),
    new raise_1.Raise()
];
/**
 * RaiseScript
 */
var RaiseScript = /** @class */ (function (_super) {
    __extends(RaiseScript, _super);
    function RaiseScript(emsg) {
        var _this = _super.call(this, [[], [emsg], [], [], [], []], raiseCode) || this;
        _this.emsg = emsg;
        return _this;
    }
    return RaiseScript;
}(script_1.Script));
exports.RaiseScript = RaiseScript;
//# sourceMappingURL=scripts.js.map