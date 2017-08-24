"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var Events = require("./Events");
var Actor = require("./Actor");
var DuplicateActorPathError_1 = require("./DuplicateActorPathError");
exports.INFO = 6;
exports.WARN = 5;
exports.ERROR = 1;
//defaults configuration
var defaults = {
    log: { level: exports.WARN, logger: console }
};
/**
 * LoggingLogic contains the logic for system logging.
 */
var LoggingLogic = (function () {
    function LoggingLogic(policy) {
        this.policy = policy;
    }
    LoggingLogic.createFrom = function (p) {
        return new LoggingLogic(p);
    };
    /**
     * childSpawned
     */
    LoggingLogic.prototype.childSpawned = function (ref) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new Events.ChildSpawnedEvent(ref));
    };
    /**
     * messageDropped
     */
    LoggingLogic.prototype.messageDropped = function (m) {
        if (this.policy.level >= exports.WARN)
            this.policy.logger.warn(new Events.MessageDroppedEvent(m.to, m.from, m.value));
    };
    /**
     * messageSent
     */
    LoggingLogic.prototype.messageSent = function (m) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new Events.MessageSentEvent(m.to, m.from, m.value));
    };
    /**
     * messageReceived
     */
    LoggingLogic.prototype.messageReceived = function (m) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new Events.MessageReceivedEvent(m.to, m.from, m.value));
    };
    /**
     * receiveStarted
     */
    LoggingLogic.prototype.receiveStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new Events.ReceiveStartedEvent(path));
    };
    /**
     * selectStarted
     */
    LoggingLogic.prototype.selectStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new Events.SelectStartedEvent(path));
    };
    return LoggingLogic;
}());
exports.LoggingLogic = LoggingLogic;
var makeChildPath = function (id, parent) {
    return ((parent === '/') || (parent === '')) ? "" + parent + id : parent + "/" + id;
};
/**
 * System is a system of actors.
 */
var System = (function () {
    function System(config, actors, logging, path) {
        if (config === void 0) { config = defaults; }
        if (actors === void 0) { actors = {}; }
        if (logging === void 0) { logging = LoggingLogic.createFrom(config.log); }
        if (path === void 0) { path = ''; }
        this.config = config;
        this.actors = actors;
        this.logging = logging;
        this.path = path;
    }
    /**
     * create a new system
     */
    System.create = function (c) {
        return new System(c);
    };
    /**
     * getPath turns an actor into its path
     */
    System.prototype.getPath = function (a) {
        var _this = this;
        if (a === this)
            return '';
        var hit = Object
            .keys(this.actors)
            .reduce(function (p, k) { return (p != null) ? p : (_this.actors[k] === a) ? k : null; }, null);
        if (hit == null)
            throw new Error("System:Could not look up address of actor! " + a);
        return hit;
    };
    /**
     * spawn a new top level actor within the system.
     */
    System.prototype.spawn = function (t, args) {
        this.putChild(t, this, args);
        return this;
    };
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    System.prototype.putChild = function (t, parent, args) {
        var path = makeChildPath(t.id, this.getPath(parent)); //@todo validate actor ids
        var child = args ? t.create.apply(this, args) : t.create(this);
        if (this.actors.hasOwnProperty(path))
            throw new DuplicateActorPathError_1.DuplicateActorPathError(path); //@todo use supervision instead
        this.actors[path] = child;
        this.logging.childSpawned(path);
        child.run(path);
        return path;
    };
    /**
     * dropMessage drops a message.
     */
    System.prototype.dropMessage = function (m) {
        this.logging.messageDropped(m);
    };
    /**
     * putContext replaces an actor's context within the system.
     */
    System.prototype.putActor = function (path, actor) {
        this.actors[path] = actor;
    };
    /**
     * putMessage places a message into an actor's context.
     *
     * Messages are enveloped to help the system keep track of
     * communication. The message may be processed or stored
     * depending on the target actor's state at the time.
     * If the target actor does not exist, the message is dropped.
     */
    System.prototype.putMessage = function (m) {
        var actor = this.actors[m.to];
        if (!actor) {
            this.dropMessage(m);
        }
        else {
            this.logging.messageSent(m);
            actor.accept(m);
        }
    };
    /**
     * askMessage allows an actor to ignore incomming messages unless
     * they have been sent by a specific actor.
     */
    System.prototype.askMessage = function (m) {
        var _this = this;
        return new Promise(function (resolve, _) {
            _this.actors[m.from] = new Actor.Pending(m.to, _this.actors[m.from], resolve, _this);
            _this.putMessage(m);
        });
    };
    System.prototype.run = function () { };
    System.prototype.accept = function (m) {
        this.dropMessage(m);
    };
    return System;
}());
exports.System = System;
//# sourceMappingURL=System.js.map