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
var event = require("../../system/log/event");
var Maybe_1 = require("afpl/lib/monad/Maybe");
var __1 = require("..");
var _1 = require(".");
var _selectErr = function (addr) {
    return new event.ErrorEvent(new Error(addr + ": called select while multiple times!"));
};
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
    function Mutable(system, mailbox, behaviour) {
        if (mailbox === void 0) { mailbox = []; }
        if (behaviour === void 0) { behaviour = Maybe_1.Maybe.fromAny(null); }
        var _this = _super.call(this, system) || this;
        _this.system = system;
        _this.mailbox = mailbox;
        _this.behaviour = behaviour;
        return _this;
    }
    /**
     * @private
     */
    Mutable.prototype.consume = function () {
        var _this = this;
        this
            .behaviour
            .chain(function (b) {
            return Maybe_1.fromArray(_this.mailbox)
                .map(function (mbox) { return mbox.shift(); })
                .map(function (m) { _this.behaviour = b.apply(m); })
                .map(function () { return _this.consume(); });
        });
    };
    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    Mutable.prototype.select = function (cases) {
        var _this = this;
        this
            .behaviour
            .map(function () { return _this.system.log(_selectErr(_this.self())); })
            .orJust(function () { return _this.behaviour = Maybe_1.fromAny(new _1.Select(cases, _this.system)); })
            .map(function () { return _this.system.log(new event.ReceiveStartedEvent(_this.self())); })
            .map(function () { return _this.consume(); })
            .map(function () { return _this; })
            .get();
        return this;
    };
    /**
     * receive is deperecated
     * @deprecated
     */
    Mutable.prototype.receive = function (fn) {
        var _this = this;
        console.warn("Mutable#receive: this method is deprecated!");
        this.behaviour =
            this
                .behaviour
                .orJust(function () { return new _1.Receive(fn, _this.system); });
        this.system.log(new event.ReceiveStartedEvent(this.system.toAddress(this).get()));
        this.consume();
        return this;
    };
    Mutable.prototype.accept = function (e) {
        this.mailbox.push(e);
        this.consume();
        return __1.accepted(e);
    };
    Mutable.prototype.run = function () { };
    return Mutable;
}(_1.Resident));
exports.Mutable = Mutable;
//# sourceMappingURL=Mutable.js.map