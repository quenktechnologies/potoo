"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./log");
/**
 * defaults for logging policy.
 */
exports.defaults = function () { return ({
    log: {
        level: log.WARN,
        logger: console
    }
}); };
//# sourceMappingURL=configuration.js.map