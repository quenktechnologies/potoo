"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var event = require("./log/event");
var Maybe_1 = require("afpl/lib/monad/Maybe");
var _1 = require(".");
/**
 * PsuedoSystem satisfies the system interface but is really a fraud.
 *
 * An actor that has a reference to this has most likely been removed
 * from the system.
 */
var PsuedoSystem = /** @class */ (function () {
    function PsuedoSystem(system) {
        this.system = system;
    }
    PsuedoSystem.prototype.toAddress = function (_) {
        return Maybe_1.Maybe.fromString(_1.DEAD_ADDRESS);
    };
    PsuedoSystem.prototype.putMessage = function (e) {
        this.system.log(new event.MessageRejectedEvent(e.to, e.from, e.message));
        return this;
    };
    PsuedoSystem.prototype.askMessage = function (e, _) {
        if (_ === void 0) { _ = Infinity; }
        this.system.log(new event.MessageRejectedEvent(e.to, e.from, e.message));
        return Promise.resolve(undefined);
    };
    PsuedoSystem.prototype.removeActor = function (_, addr) {
        var msg = "removeActor(): Cannot removed actor \"" + addr + "\" from isolated system!";
        this.system.log(new event.ErrorEvent(new Error(msg)));
        return this;
    };
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    PsuedoSystem.prototype.putChild = function (_parent, _) {
        var msg = "putChild(): Cannot put an actor in an isolated system!";
        this.system.log(new event.ErrorEvent(new Error(msg)));
        return _1.DEAD_ADDRESS;
    };
    /**
     * discard a message.
     *
     * An event will be logged to the system log.
     */
    PsuedoSystem.prototype.discard = function (e) {
        this.system.discard(e);
        return this;
    };
    PsuedoSystem.prototype.putActor = function (_path, _actor) {
        var msg = "putActor(): Cannot put an actor into an isolated system!";
        this.system.log(new event.ErrorEvent(Error(msg)));
        return this;
    };
    PsuedoSystem.prototype.putError = function (_, e) {
        this.system.log(new event.ErrorEvent(e));
        return this;
    };
    PsuedoSystem.prototype.log = function (e) {
        this.system.log(e);
        return this;
    };
    return PsuedoSystem;
}());
exports.PsuedoSystem = PsuedoSystem;
//# sourceMappingURL=PsuedoSystem.js.map