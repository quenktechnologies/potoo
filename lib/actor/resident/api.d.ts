import { Err } from '@quenk/noni/lib/control/error';
import { Address, AddressMap } from '../address';
import { System } from '../system';
import { Spawnable, Templates } from '../template';
import { Case } from './case';
/**
 * Api describes the api for implementing an actor independant
 * of the system level methods.
 */
export interface Api<S extends System> {
    /**
     * self retrieves the path of this actor from the system.
     */
    self(): string;
    /**
     * spawn a new child actor.
     */
    spawn(t: Spawnable<S>): Address;
    /**
     * spawnGroup spawns a map of actors assigning each to the specified
     * group(s).
     */
    spawnGroup(name: string | string[], tmpls: Templates<S>): AddressMap;
    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Api<S>;
    /**
     * select the next message to be processed, applying each Case
     * until one matches.
     */
    select<T>(c: Case<T>[]): Api<S>;
    /**
     * raise an error triggering the systems error handling mechanism.
     */
    raise(e: Err): Api<S>;
    /**
     * kill a child actor.
     */
    kill(addr: Address): Api<S>;
    /**
     * exit instructs the system to kill off this actor.
     */
    exit(): void;
}