"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logging = require("../log");
//Op codes.
exports.OP_RAISE = 0x64;
exports.OP_STOP = 0x0;
exports.OP_RUN = 0x1;
exports.OP_SPAWN = 0x2;
exports.OP_RESTART = 0x3;
exports.OP_TELL = 0x4;
exports.OP_DROP = 0x5;
exports.OP_RECEIVE = 0x6;
exports.OP_CHECK = 0x7;
exports.OP_READ = 0x8;
exports.OP_KILL = 0x9;
exports.OP_FLAGS = 0xa;
exports.OP_ROUTE = 0xb;
exports.OP_TRANSFER = 0xc;
/**
 * Op is an instruction executed by a System/Executor.
 */
var Op = /** @class */ (function () {
    function Op() {
    }
    return Op;
}());
exports.Op = Op;
/**
 * log an Op to the Executor's logger.
 */
exports.log = function (level, logger, o) {
    if (o.level <= level)
        switch (o.level) {
            case logging.INFO:
                logger.info(o);
                break;
            case logging.WARN:
                logger.warn(o);
                break;
            case logging.ERROR:
                logger.error(o);
                break;
            default:
                logger.log(o);
                break;
        }
    return o;
};
//# sourceMappingURL=index.js.map