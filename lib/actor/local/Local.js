"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var system_1 = require("../../system");
/**
 * Local are actors that directly exists in the current runtime.
 */
var Local = /** @class */ (function () {
    function Local(__system) {
        var _this = this;
        this.__system = __system;
        /**
         * self retrieves the path of this actor from the system.
         */
        this.self = function () { return _this.__system.toAddress(_this).get(); };
    }
    /**
     * spawn a new child actor.
     */
    Local.prototype.spawn = function (t) {
        return this.__system.putChild(this, t);
    };
    /**
     * tell a message to an actor address.
     */
    Local.prototype.tell = function (ref, m) {
        this.__system.putMessage(new system_1.Envelope(ref, this.self(), m));
        return this;
    };
    /**
     * ask for a reply from a message sent to an address.
     */
    Local.prototype.ask = function (ref, m) {
        return this.__system.askMessage(new system_1.Envelope(ref, this.self(), m));
    };
    /**
     * kill another actor.
     */
    Local.prototype.kill = function (addr) {
        this.__system.removeActor(this, addr);
        return this;
    };
    /**
     * exit instructs the system to kill of this actor.
     */
    Local.prototype.exit = function () {
        this.kill(this.self());
    };
    Local.prototype.terminate = function () {
        this.__system = new system_1.PsuedoSystem(this.__system.log());
    };
    return Local;
}());
exports.Local = Local;
//# sourceMappingURL=Local.js.map