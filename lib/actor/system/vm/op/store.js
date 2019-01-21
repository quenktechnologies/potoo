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
var _1 = require("./");
exports.OP_CODE_STORE = 0x11;
/**
 * Store the top most value on the stack in the locals array at the
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
var Store = /** @class */ (function (_super) {
    __extends(Store, _super);
    function Store(index) {
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.code = exports.OP_CODE_STORE;
        _this.level = _1.Level.Base;
        return _this;
    }
    Store.prototype.exec = function (e) {
        e.current.locals[this.index] = e.current.pop();
    };
    Store.prototype.toLog = function () {
        return "store " + this.index;
    };
    return Store;
}(_1.Op));
exports.Store = Store;
//# sourceMappingURL=store.js.map