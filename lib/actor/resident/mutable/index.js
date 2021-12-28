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
exports.Mutable = void 0;
var flags_1 = require("../../flags");
var __1 = require("../");
var function_1 = require("../case/function");
/**
 * Mutable actors can change their behaviour after message processing.
 */
var Mutable = /** @class */ (function (_super) {
    __extends(Mutable, _super);
    function Mutable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.$receivers = [];
        return _this;
    }
    Mutable.prototype.init = function (c) {
        c.flags = c.flags | flags_1.FLAG_BUFFERED;
        return c;
    };
    /**
     * select the next message in the mailbox using the provided case classes.
     *
     * If the message cannot be handled by any of them, it will be dropped.
     */
    Mutable.prototype.select = function (cases) {
        this.$receivers.push(new function_1.CaseFunction(cases));
        this.notify();
        return this;
    };
    return Mutable;
}(__1.AbstractResident));
exports.Mutable = Mutable;
//# sourceMappingURL=index.js.map