"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptFactory = void 0;
var scripts_1 = require("../../../resident/scripts");
var resident_1 = require("../../../resident");
var callback_1 = require("../../../resident/immutable/callback");
var immutable_1 = require("../../../resident/immutable");
var mutable_1 = require("../../../resident/mutable");
var scripts_2 = require("../scripts");
var __1 = require("..");
/**
 * ScriptFactory is a factory class for creating Script instances based on the
 * actor provided.
 */
var ScriptFactory = /** @class */ (function () {
    function ScriptFactory() {
    }
    /**
     * getScript appropriate for the actor instance.
     */
    ScriptFactory.getScript = function (actor) {
        var script = new scripts_2.NoScript();
        if (actor instanceof callback_1.Callback) {
            script = new scripts_1.CallbackActorScript(actor);
        }
        else if (actor instanceof immutable_1.Immutable) {
            script = new scripts_1.ImmutableActorScript(actor);
        }
        else if (actor instanceof mutable_1.Mutable) {
            script = new scripts_1.MutableActorScript(actor);
        }
        else if (actor instanceof resident_1.AbstractResident) {
            script = new scripts_1.GenericResidentScript();
        }
        else if (actor instanceof __1.PVM) {
            script = new scripts_2.VMActorScript();
        }
        return script;
    };
    return ScriptFactory;
}());
exports.ScriptFactory = ScriptFactory;
//# sourceMappingURL=factory.js.map