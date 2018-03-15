"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var local = require("../actor/local");
var log = require("./log");
var match_1 = require("@quenk/match");
var Either_1 = require("afpl/lib/monad/Either");
var Maybe_1 = require("afpl/lib/monad/Maybe");
var util_1 = require("afpl/lib/util");
var _1 = require(".");
//defaults configuration
var defaults = {
    log: { level: log.WARN, logger: console }
};
var _rejectDeadAddress = function (addr) { return match_1.match(addr)
    .caseOf(_1.DEAD_ADDRESS, function () { return Maybe_1.Maybe.fromAny(null); })
    .orElse(function () { return Maybe_1.Maybe.fromAny(addr); })
    .end(); };
var _checkExists = function (actors) { return function (path) {
    return Maybe_1.Maybe
        .fromAny(actors[path])
        .map(function () { return Either_1.left(new Error("Duplicate actor \"" + path + "\" deteced!")); })
        .orJust(function () { return Either_1.right(path); });
}; };
/**
 * ActorSystem.
 *
 * The system treats all actors equally ignoring implementation details
 * instead leaving that to the `create` function of their Templates.
 *
 * Actors are stored in the internal actors table and should never
 * be modified directly. This class provides all the methods needed for
 * actor implementations to interact with the system.
 *
 * Each implementation could be seen as a sort of "driver" that hooks into
 * a "kernel" implementation to provide functionality to an application.
 */
var ActorSystem = /** @class */ (function () {
    function ActorSystem(config, logging) {
        if (config === void 0) { config = defaults; }
        if (logging === void 0) { logging = log.LogLogic.createFrom(config.log); }
        this.config = config;
        this.logging = logging;
        /**
         * path is the static path of the system.
         *
         * Messages can be sent to this address and will be processed
         * by the system if supported.
         */
        this.path = '';
        /**
         * actors is the ActorTable where all known actor's are stored.
         */
        this.actors = { '': this };
    }
    /**
     * create a new system
     */
    ActorSystem.create = function (c) {
        if (c === void 0) { c = defaults; }
        return new ActorSystem(c);
    };
    /**
     * parentActor returns the immediate parent for an actor from the ActorTable, given
     * its address.
     */
    ActorSystem.prototype.parentActor = function (addr) {
        var _this = this;
        return Maybe_1.Maybe
            .fromAny(this.actors[addr.split(_1.SEPERATOR).slice(0, -1).join(_1.SEPERATOR)])
            .orElse(function () {
            _this.logging.error(new Error("parentActor(): Address \"" + addr + "\" has no valid parent!"));
            return Maybe_1.Maybe.fromAny(null);
        });
    };
    /**
     * toAddress turns an actor instance into an address.
     *
     * Unknown actors result in an error returning the invalid address.
     */
    ActorSystem.prototype.toAddress = function (a) {
        var _this = this;
        return Maybe_1.Maybe
            .fromAny(util_1.reduce(this.actors, function (p, c, k) {
            return (p != null) ? p : (c === a) ? k : null;
        }, null))
            .orElse(function () {
            _this
                .logging
                .error(new Error("Actor \"" + a.constructor + "\" was not found in the actor table!"));
            return Maybe_1.Maybe.fromAny(_1.DEAD_ADDRESS);
        });
    };
    /**
     * spawn a new top level actor within the system.
     *
     * Actors spawned at this level are not prefixed system
     * path and can be seen as 'root' actors.
     */
    ActorSystem.prototype.spawn = function (t) {
        this.putChild(this, t);
        return this;
    };
    ActorSystem.prototype.putChild = function (parent, t) {
        var _this = this;
        return (_1.validateId(_1.SEPERATOR)(t.id))
            .chain(function (id) {
            return _this
                .toAddress(parent)
                .chain(_rejectDeadAddress)
                .map(_1.mkChildPath(_1.SEPERATOR)(id))
                .chain(_checkExists(_this.actors))
                .get();
        })
            .map(function (path) {
            var child = t.create(_this);
            _this.actors[path] = child;
            _this.logging.childSpawned(path);
            child.run(path);
            return path;
        })
            .mapLeft(function (e) {
            _this.logging.error(e);
            return _1.DEAD_ADDRESS;
        }).takeRight();
    };
    ActorSystem.prototype.discard = function (m) {
        this.logging.messageDropped(m);
        return this;
    };
    ActorSystem.prototype.putActor = function (path, actor) {
        this.actors[path] = actor;
        return this;
    };
    ActorSystem.prototype.putMessage = function (e) {
        var _this = this;
        var actor = this.actors[e.to];
        if (!actor) {
            this.discard(e);
        }
        else {
            setTimeout(function () {
                _this.logging.messageSent(e);
                actor.accept(e);
            }, 0);
        }
        return this;
    };
    ActorSystem.prototype.putError = function (_src, e) {
        this.logging.error(e);
        return this;
    };
    ActorSystem.prototype.askMessage = function (m) {
        var _this = this;
        return new Promise(function (resolve, _) {
            _this.actors[m.from] = new local.Pending(m.to, _this.actors[m.from], resolve, _this);
            _this.putMessage(m);
        });
    };
    ActorSystem.prototype.removeActor = function (parent, addr) {
        var _this = this;
        this
            .toAddress(parent)
            .chain(function (paddr) { return Maybe_1.Maybe.fromBoolean(addr.startsWith(paddr)); })
            .orElse(function () {
            _this.logging.error(new Error("removeActor(): Actor \"" + parent + "\" is not a parent of \"" + addr + "\"!"));
            return Maybe_1.Maybe.fromAny(null);
        })
            .map(function () {
            _this.actors = util_1.reduce(_this.actors, function (p, _, k) {
                if (k === addr) {
                    _this.actors[addr].terminate();
                    _this.logging.actorRemoved(k);
                }
                else {
                    p[k] = _this.actors[k];
                }
                return p;
            }, {});
        });
        return this;
    };
    ActorSystem.prototype.log = function () {
        return this.logging;
    };
    /**
     * accept a message bound for the system.
     *
     * It will be discarded.
     */
    ActorSystem.prototype.accept = function (e) {
        this.discard(e);
        return this;
    };
    /**
     * run does nothing.
     */
    ActorSystem.prototype.run = function () { return this; };
    ActorSystem.prototype.terminate = function () { };
    return ActorSystem;
}());
exports.ActorSystem = ActorSystem;
//# sourceMappingURL=ActorSystem.js.map