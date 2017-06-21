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
/**
 * PendingContext is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
var PendingContext = (function (_super) {
    __extends(PendingContext, _super);
    function PendingContext(askee, original, resolve, system) {
        var _this = _super.call(this, original.path) || this;
        _this.askee = askee;
        _this.original = original;
        _this.resolve = resolve;
        _this.system = system;
        return _this;
    }
    PendingContext.prototype.feed = function (m) {
        if (m.from !== this.askee) {
            this.system.dropMessage(m);
        }
        else {
            this.system.putContext(this.original.path, this.original);
            this.resolve(m.message);
        }
    };
    PendingContext.prototype.start = function () { };
    return PendingContext;
}(Context_1.Context));
exports.PendingContext = PendingContext;
//# sourceMappingURL=PendingContext.js.map