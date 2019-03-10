"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
//base 
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
//control
exports.OP_CODE_IDENT = 0x33;
exports.OP_CODE_QUERY = 0x34;
exports.OP_CODE_TEMP_CC = 0x35;
exports.OP_CODE_TEMP_CHILD = 0x36;
exports.OP_CODE_RUN = 0x37;
exports.OP_CODE_RESTART = 0x38;
//actor 
exports.OP_CODE_ALLOCATE = 0x64;
exports.OP_CODE_TELL = 0x65;
exports.OP_CODE_DISCARD = 0x66;
exports.OP_CODE_RECEIVE = 0x67;
exports.OP_CODE_READ = 0x68;
exports.OP_CODE_DROP = 0x69;
exports.OP_CODE_STOP = 0x70;
exports.OP_CODE_RAISE = 0x71;
/**
 * Levels allowed for ops.
 */
var Level;
(function (Level) {
    Level[Level["Base"] = log.DEBUG] = "Base";
    Level[Level["Control"] = log.INFO] = "Control";
    Level[Level["Actor"] = log.NOTICE] = "Actor";
    Level[Level["System"] = log.WARN] = "System";
})(Level = exports.Level || (exports.Level = {}));
//# sourceMappingURL=index.js.map