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
var Receiver_1 = require("./Receiver");
/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
var LocalContext = (function (_super) {
    __extends(LocalContext, _super);
    function LocalContext(path, actorFn, system, receiver, mailbox) {
        if (receiver === void 0) { receiver = null; }
        if (mailbox === void 0) { mailbox = []; }
        var _this = _super.call(this, path) || this;
        _this.path = path;
        _this.actorFn = actorFn;
        _this.system = system;
        _this.receiver = receiver;
        _this.mailbox = mailbox;
        return _this;
    }
    LocalContext.prototype.spawn = function (t) {
        return this.system.putChild(t, this.path);
    };
    LocalContext.prototype.tell = function (ref, m) {
        this.system.putMessage(ref, this.path, m);
    };
    LocalContext.prototype.ask = function (ref, m) {
        return this.system.askMessage(ref, this.path, m);
    };
    LocalContext.prototype.receive = function (b) {
        if (this.receiver)
            throw new Error(this.path + " is already receiving!");
        this.receiver = new Receiver_1.AnyReceiver(b);
        this.system.logging.receiveStarted(this.path);
    };
    LocalContext.prototype.feed = function (m) {
        var _this = this;
        setTimeout(function () {
            if (_this.receiver)
                if (_this.receiver.willReceive(m.message)) {
                    _this.receiver.receive(m.message);
                    _this.system.logging.messageReceived(m);
                    return _this.receiver = null;
                }
            _this.mailbox.push(m.message);
        }, 0);
    };
    LocalContext.prototype.start = function () {
        this.actorFn(this).run();
    };
    return LocalContext;
}(Context_1.Context));
exports.LocalContext = LocalContext;
//# sourceMappingURL=LocalContext.js.map