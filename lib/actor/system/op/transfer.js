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
var function_1 = require("@quenk/noni/lib/data/function");
var mailbox_1 = require("../mailbox");
var drop_1 = require("./drop");
var _1 = require("./");
/**
 * Transfer instruction.
 */
var Transfer = /** @class */ (function (_super) {
    __extends(Transfer, _super);
    function Transfer(to, from, router, message) {
        var _this = _super.call(this) || this;
        _this.to = to;
        _this.from = from;
        _this.router = router;
        _this.message = message;
        _this.code = _1.OP_TRANSFER;
        _this.level = log.DEBUG;
        return _this;
    }
    Transfer.prototype.exec = function (s) {
        return exports.execTransfer(s, this);
    };
    return Transfer;
}(_1.Op));
exports.Transfer = Transfer;
/**
 * execTransfer
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
exports.execTransfer = function (s, _a) {
    var router = _a.router, to = _a.to, from = _a.from, message = _a.message;
    return s
        .state
        .getInstance(router)
        .map(function (a) { return a.accept(new mailbox_1.Envelope(to, from, message)); })
        .orJust(function () { return s.exec(new drop_1.Drop(to, from, message)); })
        .map(function_1.noop)
        .get();
};
//# sourceMappingURL=transfer.js.map