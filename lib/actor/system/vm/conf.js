"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
const log_1 = require("./log");
/**
 * defaults Conf settings.
 */
const defaults = () => ({
    log: {
        level: log_1.LOG_LEVEL_ERROR,
        logger: console
    },
    on: {},
    accept: () => { }
});
exports.defaults = defaults;
//# sourceMappingURL=conf.js.map