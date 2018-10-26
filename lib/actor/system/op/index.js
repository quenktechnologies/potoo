"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
 * Op is an instruction executed by a System.
 */
var Op = /** @class */ (function () {
    function Op() {
    }
    return Op;
}());
exports.Op = Op;
//# sourceMappingURL=index.js.map