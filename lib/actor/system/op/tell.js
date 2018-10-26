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
var log = require("../log");
var timer_1 = require("@quenk/noni/lib/control/timer");
var function_1 = require("@quenk/noni/lib/data/function");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var mailbox_1 = require("../mailbox");
var check_1 = require("./check");
var transfer_1 = require("./transfer");
var drop_1 = require("./drop");
var _1 = require("./");
/**
 * Tell instruction.
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
        return exports.execTell(s, this);
    };
    return Tell;
}(_1.Op));
exports.Tell = Tell;
/**
 * execTell
 *
 * Puts a message in the destination actor's mailbox and schedules
 * the Check instruction if the destination still exists.
 *
 * The message is dropped otherwise.
 */
exports.execTell = function (s, _a) {
    var to = _a.to, from = _a.from, message = _a.message;
    return s
        .actors
        .getRouter(to)
        .map(function (r) { return s.exec(new transfer_1.Transfer(to, from, r, message)); })
        .orElse(function () {
        return s
            .actors
            .get(to)
            .map(function (f) {
            return timer_1.tick(function () {
                f.mailbox.push(new mailbox_1.Envelope(to, from, message));
                s.exec(new check_1.Check(to));
            });
        })
            .orElse(function () {
            return maybe_1.fromNullable(s.configuration.hooks)
                .chain(function (hs) { return maybe_1.fromNullable(hs.drop); })
                .map(function (f) { return f(new mailbox_1.Envelope(to, from, message)); });
        })
            .orJust(function () { return s.exec(new drop_1.Drop(to, from, message)); });
    })
        .map(function_1.noop)
        .get();
};
//# sourceMappingURL=tell.js.map