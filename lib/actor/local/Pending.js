"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
var Pending = /** @class */ (function () {
    function Pending(askee, original, resolve, system) {
        this.askee = askee;
        this.original = original;
        this.resolve = resolve;
        this.system = system;
    }
    Pending.prototype.accept = function (e) {
        var _this = this;
        if (e.from !== this.askee) {
            //TODO: store the message instead of rejecting. 
            return __1.rejected(e);
        }
        else {
            return this
                .system
                .toAddress(this)
                .map(function (addr) {
                return _this
                    .system
                    .putActor(addr, _this.original);
            })
                .map(function () { return _this.resolve(e.message); })
                .map(function () { return __1.accepted(e); })
                .get();
        }
    };
    Pending.prototype.run = function () { };
    Pending.prototype.terminate = function () { };
    return Pending;
}());
exports.Pending = Pending;
//# sourceMappingURL=Pending.js.map