"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("./log");
/**
 * defaults Conf settings.
 */
exports.defaults = function () { return ({
    log: {
        level: log_1.LOG_LEVEL_ERROR,
        logger: console
    },
    on: {}
}); };
//# sourceMappingURL=conf.js.map