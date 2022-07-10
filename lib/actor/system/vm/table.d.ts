import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Address } from '../../address';
import { Instance } from '../..';
import { Context } from './runtime/context';
import { Thread } from './thread';
import { Map } from './map';
/**
 * ActorTableEntry is the bookkeeping record for exactly one actor within the
 * system.
 */
export interface ActorTableEntry {
    /**
     * context for the actor.
     */
    context: Context;
    /**
     * thread for actors that use threads.
     */
    thread: Maybe<Thread>;
}
/**
 * ActorTable is a map for storing bookkeeping information about all actors
 * within the system.
 *
 * If an actor is not in this table then it is not part of the system!
 */
export declare class ActorTable extends Map<ActorTableEntry> {
    /**
     * getThread provides the thread for an actor (if any).
     */
    getThread(addr: Address): Maybe<Thread>;
    /**
     * getChildren provides the [[ActorTableEntry]]'s of all the children for
     * the actor with the target address.
     *
     * While the list is not sequential, actors that are children of other
     * actors in the list are guaranteed to appear after their parents.
     */
    getChildren(addr: Address): ActorTableEntry[];
    /**
     * addressFromActor will provide the address of an actor given its instance.
     */
    addressFromActor(actor: Instance): Maybe<Address>;
}
