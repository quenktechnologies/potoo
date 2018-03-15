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
 * Mutable can change their behaviour during message processing.
 *
 * This is the Actor to extend when you want a mailbox and selective
 * receives.
 *
 * @param <A> The type of messages expected in the mailbox.
 */
var Mutable = /** @class */ (function (_super) {
    __extends(Mutable, _super);
    function Mutable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mailbox = [];
        return _this;
    }
    /**
     * @private
     */
    Mutable.prototype.consume = function () {
        if (this.mailbox.length === 0)
            return;
        if (!this.behaviour)
            return;
        var m = this.mailbox.shift();
        this.behaviour = this.behaviour.consume(m);
        this.consume();
    };
    Mutable.prototype.select = function (c) {
        var cases = Array.isArray(c) ? c : [c];
        this.behaviour = new _1.Select(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;
    };
    Mutable.prototype.receive = function (c) {
        var cases = Array.isArray(c) ? c : [c];
        this.behaviour = new _1.Receive(cases, this.system);
        this.system.log().receiveStarted(this.system.toAddress(this).get());
        this.consume();
        return this;
    };
    Mutable.prototype.accept = function (e) {
        this.system.log().messageAccepted(e);
        this.mailbox.push(e);
        this.consume();
        return this;
    };
    Mutable.prototype.run = function () { return this; };
    return Mutable;
}(_1.Local));
exports.Mutable = Mutable;
//# sourceMappingURL=Mutable.js.map