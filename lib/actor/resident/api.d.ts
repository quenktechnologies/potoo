import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Address, AddressMap } from '../address';
import { Spawnable, Templates } from '../template';
/**
 * Spawner is an object that can spawn a new actor.
 */
export interface Spawner {
    /**
     * spawn an actor from a template.
     */
    spawn(t: Spawnable): Address;
}
/**
 * Api describes the api for implementing an actor independant
 * of the system level methods.
 */
export interface Api extends Spawner {
    self(): string;
    /**
     * spawnGroup spawns a map of actors assigning each to the specified
     * group(s).
     */
    spawnGroup(name: string | string[], tmpls: Templates): AddressMap;
    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Api;
    /**
     * raise an error triggering the systems error handling mechanism.
     */
    raise(e: Err): Api;
    /**
     * kill a child actor.
     */
    kill(addr: Address): Api;
    /**
     * wait on a Future to complete blocking the actor until it does.
     *
     * The blocking only occurs in the VM and not the JS event loop. Errors are
     * propagated through the event handling machinery and any return values
     * are ignored.
     */
    wait(ft: Future<void>): void;
    /**
     * exit instructs the system to kill off this actor.
     */
    exit(): void;
}
