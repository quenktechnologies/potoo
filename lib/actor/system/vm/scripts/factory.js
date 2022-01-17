"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptFactory = void 0;
const scripts_1 = require("../../../resident/scripts");
const resident_1 = require("../../../resident");
const callback_1 = require("../../../resident/immutable/callback");
const immutable_1 = require("../../../resident/immutable");
const mutable_1 = require("../../../resident/mutable");
const scripts_2 = require("../scripts");
const __1 = require("..");
/**
 * ScriptFactory is a factory class for creating Script instances based on the
 * actor provided.
 */
class ScriptFactory {
    /**
     * getScript appropriate for the actor instance.
     */
    static getScript(actor) {
        let script = new scripts_2.NoScript();
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
    }
}
exports.ScriptFactory = ScriptFactory;
//# sourceMappingURL=factory.js.map