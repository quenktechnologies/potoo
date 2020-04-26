import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Instance } from '../';
import { Script } from './vm/script';
import { PTValue } from './vm/type';

/**
 * System represents a dynamic collection of actors that 
 * can communicate with each other via message passing.
 */
export interface System {

    /**
     * exec executes a VM script on behalf on an actor.
     */
    exec(i: Instance, s: Script): void

    /**
     * execNow executes a VM script but skips the scheduling queue completely.
     *
     * Use with caution.
     */
    execNow(i: Instance, s: Script): Maybe<PTValue>

}
