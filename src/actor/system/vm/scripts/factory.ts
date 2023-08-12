import {
    CallbackActorScript,
    GenericResidentScript,
    ImmutableActorScript,
    MutableActorScript
} from '../../../resident/scripts';
import { AbstractResident } from '../../../resident';
import { Callback } from '../../../resident/immutable/callback';
import { Immutable } from '../../../resident/immutable';
import {  Mutable } from '../../../resident/mutable';
import { Instance } from '../../../';
import { Script } from '../script';
import { NoScript, VMActorScript } from '../scripts';
import { PVM } from '..';

/**
 * ScriptFactory is a factory class for creating Script instances based on the
 * actor provided.
 */
export class ScriptFactory {

    /**
     * getScript appropriate for the actor instance.
     */
    static getScript(actor: Instance): Script {

        let script: Script = new NoScript();

        if (actor instanceof Callback) {

            script = new CallbackActorScript(actor);

        } else if (actor instanceof Immutable) {

            script = new ImmutableActorScript(actor);

        } else if (actor instanceof Mutable) {

            script = new MutableActorScript(actor);

        } else if (actor instanceof AbstractResident) {

          script = new GenericResidentScript();

        } else if (actor instanceof PVM) {

            script = new VMActorScript();

        }

        return script;

    }

}
