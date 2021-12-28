import { Instance } from '../../../';
import { Script } from '../script';
/**
 * ScriptFactory is a factory class for creating Script instances based on the
 * actor provided.
 */
export declare class ScriptFactory {
    /**
     * getScript appropriate for the actor instance.
     */
    static getScript(actor: Instance): Script;
}
