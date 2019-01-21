"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
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
/**
 * Op code.
 *
 * Implementations of this class carry out a single task
 * in the Executor's context.
 */
var Op = /** @class */ (function () {
    function Op() {
    }
    return Op;
}());
exports.Op = Op;
//# sourceMappingURL=index.js.map