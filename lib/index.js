"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require("./actor/system/configuration");
var record_1 = require("@quenk/noni/lib/data/record");
var system_1 = require("./actor/system");
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
exports.system = function (conf) {
    return new system_1.ActorSystem([], record_1.rmerge(conf, config.defaults()));
};
//# sourceMappingURL=index.js.map