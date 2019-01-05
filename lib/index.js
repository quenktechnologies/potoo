"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var default_1 = require("./actor/system/default");
exports.ActorSystem = default_1.ActorSystem;
exports.system = default_1.system;
var resident_1 = require("./actor/system/default/actors/resident");
exports.Mutable = resident_1.Mutable;
exports.Immutable = resident_1.Immutable;
var case_1 = require("./actor/resident/case");
exports.Case = case_1.CaseClass;
//# sourceMappingURL=index.js.map