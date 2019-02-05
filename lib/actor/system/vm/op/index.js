"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
exports.OP_CODE_NOOP = 0x0;
exports.OP_CODE_PUSH_NUM = 0x1;
exports.OP_CODE_PUSH_STR = 0x2;
exports.OP_CODE_PUSH_FUNC = 0x3;
exports.OP_CODE_PUSH_MSG = 0x4;
exports.OP_CODE_PUSH_TEMP = 0x5;
exports.OP_CODE_PUSH_FOREIGN = 0x6;
exports.OP_CODE_DUP = 0x7;
exports.OP_CODE_ADD = 0x8;
exports.OP_CODE_CMP = 0x9;
exports.OP_CODE_CALL = 0xa;
exports.OP_CODE_STORE = 0xb;
exports.OP_CODE_LOAD = 0xc;
exports.OP_CODE_JUMP = 0xd;
exports.OP_CODE_JUMP_IF_ONE = 0xe;
exports.OP_CODE_QUERY = 0x20;
exports.OP_CODE_ALLOCATE = 0x21;
exports.OP_CODE_TEMP_CC = 0x22;
exports.OP_CODE_TEMP_CHILD = 0x23;
exports.OP_CODE_TELL = 0x24;
exports.OP_CODE_DISCARD = 0x25;
exports.OP_CODE_RUN = 0x26;
exports.OP_CODE_RECEIVE = 0x27;
exports.OP_CODE_READ = 0x28;
exports.OP_CODE_RESTART = 0x29;
exports.OP_CODE_DROP = 0x30;
exports.OP_CODE_STOP = 0x2a;
exports.OP_CODE_RAISE = 0xb;
/**
 * Levels allowed for ops.
 */
var Level;
(function (Level) {
    Level[Level["Base"] = log.DEBUG] = "Base";
    Level[Level["Control"] = log.DEBUG] = "Control";
    Level[Level["Actor"] = log.INFO] = "Actor";
    Level[Level["System"] = log.WARN] = "System";
})(Level = exports.Level || (exports.Level = {}));
//# sourceMappingURL=index.js.map