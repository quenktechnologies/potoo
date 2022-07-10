"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
const log_1 = require("./log");
/**
 * defaults for VM configuration.
 */
const defaults = () => ({
    log_level: log_1.LOG_LEVEL_ERROR,
    long_sink: console,
    on: {},
    accept: () => { }
});
exports.defaults = defaults;
//# sourceMappingURL=conf.js.map