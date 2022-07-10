"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = exports.EVENT_ACTOR_STOPPED = exports.EVENT_ACTOR_STARTED = exports.EVENT_ACTOR_CREATED = exports.EVENT_MESSAGE_DROPPED = exports.EVENT_MESSAGE_READ = exports.EVENT_EXEC_ACTOR_CHANGED = exports.EVENT_EXEC_ACTOR_GONE = exports.EVENT_EXEC_INSTANCE_STALE = exports.EVENT_SEND_FAILED = exports.EVENT_SEND_OK = exports.EVENT_SEND_START = void 0;
exports.EVENT_SEND_START = 'message-send-start';
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
 * Publisher serves as the EventSource implementation for the VM.
 */
class Publisher {
    constructor(log, handlers = {}) {
        this.log = log;
        this.handlers = handlers;
    }
    on(evt, handler) {
        let handlers = this.handlers[evt] || [];
        handlers.push(handler);
        this.handlers[evt] = handlers;
    }
    publish(addr, evt, ...args) {
        let handlers = this.handlers[evt];
        if (handlers)
            handlers.forEach(handler => handler(addr, evt, ...args));
        this.log.event(addr, evt, ...args);
    }
}
exports.Publisher = Publisher;
//# sourceMappingURL=event.js.map