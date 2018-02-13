"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
            this.system.discard(e);
        }
        else {
            this
                .system
                .toAddress(this)
                .map(function (addr) {
                return _this
                    .system
                    .putActor(addr, _this.original);
            })
                .map(function () { return _this.resolve(e.value); })
                .get();
        }
    };
    Pending.prototype.run = function () { };
    Pending.prototype.terminate = function () { };
    return Pending;
}());
exports.Pending = Pending;
//# sourceMappingURL=Pending.js.map