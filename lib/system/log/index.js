"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event = require("./event");
/**
 * This module provides some logging primitives for the system.
 */
/**
 * INFO log level.
 */
exports.INFO = 6;
/**
 * WARN log level.
 */
exports.WARN = 5;
/**
 * ERROR log level.
 */
exports.ERROR = 1;
/**
 * LogLogic provides methods for telling the story of the system
 * and its actor's lifecycles.
 *
 * Actor implementation MUST call the repsective methods
 * as they take action otherwise they will not appear in the system log.
 */
var LogLogic = /** @class */ (function () {
    function LogLogic(policy) {
        this.policy = policy;
    }
    LogLogic.createFrom = function (p) {
        return new LogLogic(p);
    };
    /**
     * error
     */
    LogLogic.prototype.error = function (e) {
        if (this.policy.level >= exports.ERROR)
            this.policy.logger.error(new event.ErrorEvent(e));
    };
    /**
     * childSpawned
     */
    LogLogic.prototype.childSpawned = function (ref) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.ChildSpawnedEvent(ref));
    };
    /**
     * messageDropped
     */
    LogLogic.prototype.messageDropped = function (e) {
        if (this.policy.level >= exports.WARN)
            this.policy.logger.warn(new event.MessageDroppedEvent(e.to, e.from, e.value));
    };
    /**
     * messageSent
     */
    LogLogic.prototype.messageSent = function (e) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.MessageSentEvent(e.to, e.from, e.value));
    };
    /**
     * messageAccepted
     */
    LogLogic.prototype.messageAccepted = function (e) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.MessageAcceptedEvent(e.to, e.from, e.value));
    };
    /**
     * messageReceived
     */
    LogLogic.prototype.messageReceived = function (e) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.MessageReceivedEvent(e.to, e.from, e.value));
    };
    /**
     * messageRejected
     */
    LogLogic.prototype.messageRejected = function (e) {
        if (this.policy.level >= exports.WARN)
            this.policy.logger.warn(new event.MessageRejectedEvent(e.to, e.from, e.value));
    };
    /**
     * receiveStarted
     */
    LogLogic.prototype.receiveStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.ReceiveStartedEvent(path));
    };
    /**
     * selectStarted
     */
    LogLogic.prototype.selectStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.SelectStartedEvent(path));
    };
    /**
     * actorRemoved
     */
    LogLogic.prototype.actorRemoved = function (path) {
        this.policy.logger.info(new event.ActorRemovedEvent(path));
    };
    return LogLogic;
}());
exports.LogLogic = LogLogic;
//# sourceMappingURL=index.js.map