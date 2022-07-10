"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogWriter = exports.LOG_LEVEL_ERROR = exports.LOG_LEVEL_WARN = exports.LOG_LEVEL_NOTICE = exports.LOG_LEVEL_INFO = exports.LOG_LEVEL_DEBUG = exports.LOG_LEVEL_TRACE = void 0;
const events = require("./event");
const op_1 = require("./runtime/op");
exports.LOG_LEVEL_TRACE = 8;
exports.LOG_LEVEL_DEBUG = 7;
exports.LOG_LEVEL_INFO = 6;
exports.LOG_LEVEL_NOTICE = 5;
exports.LOG_LEVEL_WARN = 4;
exports.LOG_LEVEL_ERROR = 3;
/**
 * LogWriter provides an implementation of [[LogWritable]] for the VM.
 */
class LogWriter {
    constructor(sink, level) {
        this.sink = sink;
        this.level = level;
    }
    opcode(thr, frame, op, operand) {
        if (this.level >= exports.LOG_LEVEL_TRACE)
            this.sink.debug.apply(this.sink, [
                `[${thr.context.address}]`,
                `(${frame.script.name}#${frame.name})`,
                ...(0, op_1.toLog)(op, thr, frame, operand)
            ]);
    }
    event(addr, evt, ...args) {
        let level = getLevel(evt);
        if (this.level >= level) {
            let { sink } = this;
            switch (level) {
                case exports.LOG_LEVEL_DEBUG:
                    sink.debug(addr, evt, args);
                    break;
                case exports.LOG_LEVEL_INFO:
                    sink.info(addr, evt, args);
                    break;
                case exports.LOG_LEVEL_NOTICE:
                case exports.LOG_LEVEL_WARN:
                    sink.warn(addr, evt, args);
                    break;
                case exports.LOG_LEVEL_ERROR:
                    sink.error(addr, evt, args);
                    break;
                default:
                    break;
            }
        }
    }
}
exports.LogWriter = LogWriter;
const eventLevels = {
    [events.EVENT_ACTOR_CREATED]: {
        level: exports.LOG_LEVEL_INFO
    },
    [events.EVENT_ACTOR_STARTED]: {
        level: exports.LOG_LEVEL_INFO
    },
    [events.EVENT_SEND_START]: {
        level: exports.LOG_LEVEL_INFO
    },
    [events.EVENT_SEND_OK]: {
        level: exports.LOG_LEVEL_INFO
    },
    [events.EVENT_MESSAGE_READ]: {
        level: exports.LOG_LEVEL_INFO
    },
    [events.EVENT_SEND_FAILED]: {
        level: exports.LOG_LEVEL_WARN
    },
    [events.EVENT_MESSAGE_DROPPED]: {
        level: exports.LOG_LEVEL_WARN
    },
    [events.EVENT_EXEC_INSTANCE_STALE]: {
        level: exports.LOG_LEVEL_WARN
    },
    [events.EVENT_EXEC_ACTOR_GONE]: {
        level: exports.LOG_LEVEL_WARN
    }
};
/**
 * getLevel provides the LogLevel for an event.
 *
 * If none is configured LOG_LEVEL_DEBUG is used.
 * @private
 */
const getLevel = (e) => eventLevels.hasOwnProperty(e) ?
    eventLevels[e].level : exports.LOG_LEVEL_DEBUG;
//# sourceMappingURL=log.js.map