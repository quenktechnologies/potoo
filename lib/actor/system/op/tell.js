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
var log = require("../log");
var timer_1 = require("@quenk/noni/lib/control/timer");
var function_1 = require("@quenk/noni/lib/data/function");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var mailbox_1 = require("../../mailbox");
var state_1 = require("../state");
var check_1 = require("./check");
var transfer_1 = require("./transfer");
var discard_1 = require("./discard");
var _1 = require("./");
/**
 * Tell instruction.
 *
 * If there is a router registered for the "to" address, the message
 * is transfered to that address. Otherwise, provided the actor exists,
 * we put the message in it's mailbox and schedule a Check.
 *
 * The message is dropped otherwise.
 */
var Tell = /** @class */ (function (_super) {
    __extends(Tell, _super);
    function Tell(to, from, message) {
        var _this = _super.call(this) || this;
        _this.to = to;
        _this.from = from;
        _this.message = message;
        _this.code = _1.OP_TELL;
        _this.level = log.INFO;
        return _this;
    }
    Tell.prototype.exec = function (s) {
        return execTell(s, this);
    };
    return Tell;
}(_1.Op));
exports.Tell = Tell;
var execTell = function (s, op) {
    return state_1.getRouter(s.state, op.to)
        .map(runTransfer(s, op))
        .orElse(runTell(s, op))
        .orElse(invokeDropHook(s, op))
        .orJust(justDrop(s, op))
        .map(function_1.noop)
        .get();
};
var runTransfer = function (s, _a) {
    var to = _a.to, from = _a.from, message = _a.message;
    return function (r) {
        return s.exec(new transfer_1.Transfer(to, from, r, message));
    };
};
var runTell = function (s, op) { return function () {
    return state_1.get(s.state, op.to).chain(doTell(s, op));
}; };
var doTell = function (s, op) { return function (f) {
    return f
        .mailbox
        .map(doTellMailbox(s, op))
        .orJust(function () { return f.actor.accept(toEnvelope(op)); });
}; };
var doTellMailbox = function (s, _a) {
    var to = _a.to, from = _a.from, message = _a.message;
    return function (m) {
        return timer_1.tick(function () {
            m.push(new mailbox_1.Envelope(to, from, message));
            s.exec(new check_1.Check(to));
        });
    };
};
var invokeDropHook = function (s, op) { return function () {
    return maybe_1.fromNullable(s.configuration.hooks)
        .chain(function (h) { return maybe_1.fromNullable(h.drop); })
        .map(function (f) { return f(toEnvelope(op)); });
}; };
var justDrop = function (s, _a) {
    var to = _a.to, from = _a.from, message = _a.message;
    return function () {
        return s.exec(new discard_1.Discard(to, from, message));
    };
};
var toEnvelope = function (_a) {
    var to = _a.to, from = _a.from, message = _a.message;
    return new mailbox_1.Envelope(to, from, message);
};
//# sourceMappingURL=tell.js.map