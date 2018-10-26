"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("./actor/system/log");
var record_1 = require("@quenk/noni/lib/data/record");
var system_1 = require("./actor/system");
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
exports.system = function (conf) {
    if (conf === void 0) { conf = {}; }
    return new system_1.ActorSystem([], record_1.rmerge({
        log: {
            level: log.WARN,
            logger: console
        }
    }, conf));
};
//# sourceMappingURL=index.js.map