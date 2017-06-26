"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalActor_1 = require("./LocalActor");
exports.LocalActor = LocalActor_1.LocalActor;
exports.LocalTemplate = LocalActor_1.Template;
var Case_1 = require("./Case");
exports.Case = Case_1.Case;
var System_1 = require("./System");
exports.System = System_1.System;
/**
 * system creates a new actor system with the specified configuration.
 */
exports.system = function (c) { return System_1.System.create(c); };
//# sourceMappingURL=index.js.map