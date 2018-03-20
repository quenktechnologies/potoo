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
 * SystemLogLogic implementation.
 */
var SystemLogLogic = /** @class */ (function () {
    function SystemLogLogic(policy) {
        this.policy = policy;
    }
    SystemLogLogic.createFrom = function (p) {
        return new SystemLogLogic(p);
    };
    /**
     * log an event.
     *
     * If the event level is less than the current policy level
     * then it will not be logged.
     */
    SystemLogLogic.prototype.log = function (e) {
        if (this.policy.level >= e.level)
            if (e.level >= exports.INFO)
                this.policy.logger.info(e);
            else if (e.level >= exports.WARN)
                this.policy.logger.warn(e);
            else if (e.level >= exports.ERROR)
                this.policy.logger.error(e);
        return this;
    };
    /**
     * error
     */
    SystemLogLogic.prototype.error = function (e) {
        if (this.policy.level >= exports.ERROR)
            this.policy.logger.error(new event.ErrorEvent(e));
        return this;
    };
    /**
     * childSpawned
     */
    SystemLogLogic.prototype.childSpawned = function (ref) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.ChildSpawnedEvent(ref));
    };
    /**
     * messageDropped
     */
    SystemLogLogic.prototype.messageDropped = function (e) {
        if (this.policy.level >= exports.WARN)
            this.policy.logger.warn(new event.MessageDroppedEvent(e.to, e.from, e.message));
    };
    /**
     * messageSent
     */
    SystemLogLogic.prototype.messageSent = function (e) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.MessageSentEvent(e.to, e.from, e.message));
    };
    /**
     * messageAccepted
     */
    SystemLogLogic.prototype.messageAccepted = function (e) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.MessageAcceptedEvent(e.to, e.from, e.message));
    };
    /**
     * messageReceived
     */
    SystemLogLogic.prototype.messageReceived = function (e) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.MessageReceivedEvent(e.to, e.from, e.message));
    };
    /**
     * messageRejected
     */
    SystemLogLogic.prototype.messageRejected = function (e) {
        if (this.policy.level >= exports.WARN)
            this.policy.logger.warn(new event.MessageRejectedEvent(e.to, e.from, e.message));
    };
    /**
     * receiveStarted
     */
    SystemLogLogic.prototype.receiveStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.ReceiveStartedEvent(path));
    };
    /**
     * selectStarted
     */
    SystemLogLogic.prototype.selectStarted = function (path) {
        if (this.policy.level >= exports.INFO)
            this.policy.logger.info(new event.SelectStartedEvent(path));
    };
    /**
     * actorRemoved
     */
    SystemLogLogic.prototype.actorRemoved = function (path) {
        this.policy.logger.info(new event.ActorRemovedEvent(path));
    };
    return SystemLogLogic;
}());
exports.SystemLogLogic = SystemLogLogic;
//# sourceMappingURL=index.js.map