import { Maybe, fromString, nothing } from '@quenk/noni/lib/data/maybe';
import { empty, reduce, values } from '@quenk/noni/lib/data/record';

import { Address, isChild } from '../../address';
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
    context: Context,

    /**
     * thread for actors that use threads.
     */
    thread: Maybe<Thread>

}

/**
 * ActorTable is a map for storing bookkeeping information about all actors
 * within the system.
 *
 * If an actor is not in this table then it is not part of the system!
 */
export class ActorTable extends Map<ActorTableEntry> {

    /**
     * getThread provides the thread for an actor (if any).
     */
    getThread(addr: Address) {

        return this.get(addr).chain(ate => ate.thread);

    }

    /**
     * getChildren provides the [[ActorTableEntry]]'s of all the children for 
     * the actor with the target address.
     *
     * While the list is not sequential, actors that are children of other 
     * actors in the list are guaranteed to appear after their parents.
     */
    getChildren(addr: Address): ActorTableEntry[] {

        if (!this.has(addr)) return [];

        let firstRun = true;
        let idx = 0;
        let maxRec = 0;
        let unsortedItems: ActorTableEntry[] = [];
        let items = values(this.items);
        let init: [ActorTableEntry[], ActorTableEntry[]] = [[], []];

        while (true) {

            let result = items.reduce((prev, curr: ActorTableEntry) =>
                <[ActorTableEntry[], ActorTableEntry[]]>(
                    isChild(addr, curr.context.address) ?
                        [prev[0], [...prev[1], curr]] :
                        [[...prev[0], curr], prev[1]]), init);

            if (firstRun) {

                if (empty(result[1])) return result[1];

                items = result[1];

                unsortedItems = items.slice();

                addr = items[0].context.address;

                maxRec = items.length;

                firstRun = false;

            } else {

                items = [...result[0], ...result[1]];

                idx++;

                if (idx >= maxRec) break;

                addr = unsortedItems[idx].context.address;

            }

        }

        return items;

    }

    /**
     * addressFromActor will provide the address of an actor given its instance.
     */
    addressFromActor(actor: Instance): Maybe<Address> {

        return reduce(this.items, nothing(), (pre: Maybe<Address>, items, k) =>
            items.context.actor === actor ? fromString(k) : pre);

    }

}
