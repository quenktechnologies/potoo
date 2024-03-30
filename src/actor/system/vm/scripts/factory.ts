import { Script } from '../script';
import { NoScript } from '../scripts';

/**
 * ScriptFactory is a factory class for creating Script instances based on the
 * actor provided.
 */
export class ScriptFactory {
    /**
     * getScript appropriate for the actor instance.
     */
    static getScript(): Script {
        return new NoScript();
    }
}
