import { Instance } from '../';
import { Script } from './vm/script';
/**
 * System represents a dynamic collection of actors that
 * can communicate with each other via message passing.
 */
export interface System {
    /**
     * exec executes a VM script on behalf on an actor.
     */
    exec(i: Instance, s: Script): void;
}
