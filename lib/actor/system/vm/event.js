"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
exports.EVENT_SEND_OK = 'message-send-ok';
exports.EVENT_SEND_FAILED = 'message-send-failed';
exports.EVENT_EXEC_INSTANCE_STALE = 'exec-instance-stale';
exports.EVENT_EXEC_ACTOR_GONE = 'exec-actor-gone';
exports.EVENT_EXEC_ACTOR_CHANGED = 'exec-actor-changed';
exports.EVENT_MESSAGE_READ = 'message-read';
exports.EVENT_MESSAGE_DROPPED = 'message-dropped';
exports.EVENT_ACTOR_CREATED = 'actor-created';
exports.EVENT_ACTOR_STARTED = 'actor-started';
exports.EVENT_ACTOR_STOPPED = 'actor-stopped';
/**
 * events holds the EventInfo details for all system events.
 */
exports.events = (_a = {},
    _a[exports.EVENT_ACTOR_CREATED] = {
        level: log_1.LOG_LEVEL_INFO
    },
    _a[exports.EVENT_ACTOR_STARTED] = {
        level: log_1.LOG_LEVEL_INFO
    },
    _a[exports.EVENT_SEND_OK] = {
        level: log_1.LOG_LEVEL_INFO
    },
    _a[exports.EVENT_MESSAGE_READ] = {
        level: log_1.LOG_LEVEL_INFO
    },
    _a[exports.EVENT_SEND_FAILED] = {
        level: log_1.LOG_LEVEL_WARN
    },
    _a[exports.EVENT_MESSAGE_DROPPED] = {
        level: log_1.LOG_LEVEL_WARN
    },
    _a[exports.EVENT_EXEC_INSTANCE_STALE] = {
        level: log_1.LOG_LEVEL_WARN
    },
    _a[exports.EVENT_EXEC_ACTOR_GONE] = {
        level: log_1.LOG_LEVEL_WARN
    },
    _a[exports.EVENT_EXEC_ACTOR_CHANGED] = {
        level: log_1.LOG_LEVEL_WARN
    },
    _a[exports.EVENT_ACTOR_STOPPED] = {
        level: log_1.LOG_LEVEL_WARN
    },
    _a);
/**
 * getLevel provides the LogLevel for an event.
 *
 * If none is configured LOG_LEVEL_DEBUG is used.
 */
exports.getLevel = function (e) { return exports.events.hasOwnProperty(e) ?
    exports.events[e].level : log_1.LOG_LEVEL_DEBUG; };
//# sourceMappingURL=event.js.map