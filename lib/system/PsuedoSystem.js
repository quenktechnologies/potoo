"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var Maybe_1 = require("afpl/lib/monad/Maybe");
var _1 = require(".");
/**
 * PsuedoSystem satisfies the system interface but is really a fraud.
 *
 * An actor that has a reference to this has most likely been removed
 * from the system.
 */
var PsuedoSystem = /** @class */ (function () {
    function PsuedoSystem(logging) {
        this.logging = logging;
    }
    PsuedoSystem.prototype.toAddress = function (_) {
        return Maybe_1.Maybe.fromString(_1.DEAD_ADDRESS);
    };
    PsuedoSystem.prototype.putMessage = function (e) {
        this.logging.messageRejected(e);
        return this;
    };
    PsuedoSystem.prototype.askMessage = function (e) {
        this.logging.messageRejected(e);
        return Promise.resolve(undefined);
    };
    PsuedoSystem.prototype.removeActor = function (_, addr) {
        this.logging.error(new Error("removeActor(): Cannot removed actor \"" + addr + "\" from isolated system!"));
        return this;
    };
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    PsuedoSystem.prototype.putChild = function (_parent, _) {
        this.logging.error(new Error("putChild(): Cannot put an actor in an isolated system!"));
        return _1.DEAD_ADDRESS;
    };
    /**
     * discard a message.
     *
     * An event will be logged to the system log.
     */
    PsuedoSystem.prototype.discard = function (e) {
        this.logging.messageDropped(e);
        return this;
    };
    PsuedoSystem.prototype.putActor = function (_path, _actor) {
        this.logging.error(new Error("putActor(): Cannot put an actor into an isolated system!"));
        return this;
    };
    PsuedoSystem.prototype.log = function () {
        return this.logging;
    };
    return PsuedoSystem;
}());
exports.PsuedoSystem = PsuedoSystem;
//# sourceMappingURL=PsuedoSystem.js.map