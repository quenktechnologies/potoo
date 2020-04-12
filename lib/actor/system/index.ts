import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Instance } from '../';
import { PVM_Value, Script } from './vm/script';

/**
 * System represents a dynamic collection of actors that 
 * can communicate with each other via message passing.
 */
export interface System {

    /**
     * exec executes a VM script on behalf on an actor.
     */
    exec(i: Instance, s: Script): Maybe<PVM_Value>

}
