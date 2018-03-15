"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
var Dynamic = /** @class */ (function (_super) {
    __extends(Dynamic, _super);
    function Dynamic() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mailbox = [];
        return _this;
    }
    /**
     * @private
     */
    Dynamic.prototype.consume = function () {
        if (this.mailbox.length === 0)
            return;
        if (!this.behaviour)
            return;
        var m = this.mailbox.shift();
        this.behaviour = this.behaviour.consume(m);
        this.consume();
    };
    Dynamic.prototype.select = function (c) {
        var cases = Array.isArray(c) ? c : [c];
        this.behaviour = new _1.Select(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;
    };
    Dynamic.prototype.receive = function (c) {
        var cases = Array.isArray(c) ? c : [c];
        this.behaviour = new _1.Receive(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;
    };
    Dynamic.prototype.accept = function (e) {
        this.system.log().messageAccepted(e);
        this.mailbox.push(e);
        this.consume();
        return this;
    };
    Dynamic.prototype.run = function () { return this; };
    return Dynamic;
}(_1.Local));
exports.Dynamic = Dynamic;
//# sourceMappingURL=Dynamic.js.map