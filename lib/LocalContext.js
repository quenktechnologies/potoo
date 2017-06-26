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
var Context_1 = require("./Context");
var Behaviour_1 = require("./Behaviour");
/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
var LocalContext = (function (_super) {
    __extends(LocalContext, _super);
    function LocalContext(path, actorFn, system, behaviour, mailbox, isClearing) {
        if (behaviour === void 0) { behaviour = null; }
        if (mailbox === void 0) { mailbox = []; }
        if (isClearing === void 0) { isClearing = false; }
        var _this = _super.call(this, path) || this;
        _this.path = path;
        _this.actorFn = actorFn;
        _this.system = system;
        _this.behaviour = behaviour;
        _this.mailbox = mailbox;
        _this.isClearing = isClearing;
        return _this;
    }
    LocalContext.prototype._clear = function () {
        if ((!this.isClearing) &&
            (this.behaviour !== null) &&
            (this.mailbox.length > 0) &&
            (this.behaviour.willConsume(this.mailbox[0].message))) {
            var b = this.behaviour;
            var m = this.mailbox.shift();
            this.isClearing = true;
            this.behaviour = null;
            b.consume(m.message);
            this.system.logging.messageReceived(m);
            this.isClearing = false;
            return true;
        }
        else {
            return false;
        }
    };
    LocalContext.prototype._set = function (b) {
        if (this.behaviour != null)
            throw new Error(this.path + " is already receiveing/selecting!");
        this.behaviour = b;
        return this;
    };
    LocalContext.prototype.discard = function (m) {
        this.system.dropMessage(m);
    };
    LocalContext.prototype.spawn = function (t) {
        return this.system.putChild(t, this.path);
    };
    LocalContext.prototype.tell = function (ref, m) {
        this.system.putMessage(ref, this.path, m);
    };
    LocalContext.prototype.ask = function (ref, m) {
        return this.system.askMessage(ref, this.path, m);
    };
    LocalContext.prototype.select = function (c) {
        this._set(new Behaviour_1.MatchCase(c));
        this.system.logging.selectStarted(this.path);
        this._clear();
    };
    LocalContext.prototype.receive = function (f) {
        this._set(new Behaviour_1.MatchAny(f));
        this.system.logging.receiveStarted(this.path);
        this._clear();
    };
    LocalContext.prototype.feed = function (m) {
        var _this = this;
        setTimeout(function () { return (_this.mailbox.unshift(m), _this._clear()); }, 0);
    };
    LocalContext.prototype.start = function () {
        this.actorFn(this).run();
    };
    return LocalContext;
}(Context_1.Context));
exports.LocalContext = LocalContext;
//# sourceMappingURL=LocalContext.js.map