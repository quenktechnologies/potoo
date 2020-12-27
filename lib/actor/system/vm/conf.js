"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
var log_1 = require("./log");
/**
 * defaults Conf settings.
 */
exports.defaults = function () { return ({
    log: {
        level: log_1.LOG_LEVEL_ERROR,
        logger: console
    },
    on: {},
    accept: function () { }
}); };
//# sourceMappingURL=conf.js.map