import { Maybe } from '@quenk/noni/lib/data/maybe';
import { empty } from '@quenk/noni/lib/data/record';

import { Address, getParent, isChild } from '../../address';
import { Instance } from '../..';
import { Thread } from './thread';

/**
 * ActorTableEntry is the bookkeeping record for exactly one actor within the
 * system.
 */
export interface ActorTableEntry {
    /**
     * parent is the entry for the parent actor.
     *
     * No parent indicates the root actor.
     */
    parent: Maybe<ActorTableEntry>;

    /**
     * actor instance for the entry.
     */
    actor: Instance;

    /**
     * thread for the entry.
     */
    thread: Thread;

    /**
     * children entries for the actor.
     */
    children: ActorTableEntry[];
}

/**
 * ActorTable is a map for storing bookkeeping information about all actors
 * within the system.
 *
 * It is an abstraction for accessing actors, threads and their children within
 * the system. If an actor is not in this table then it is not part of the
 * system!
 */
export class ActorTable {
    constructor(public items = new Map()) {}

    /**
     * getForThread provides the entry for an actor given its thread.
     */
    getForThread(thread: Thread): Maybe<ActorTableEntry> {
        for (let entry of this.items.values()) {
            if (entry.thread === thread) return Maybe.of(entry);
        }

        return Maybe.nothing();
    }

    /**
     * get the entry for an actor given its address.
     */
    get(addr: Address): Maybe<ActorTableEntry> {
        return Maybe.of(this.items.get(addr));
    }

    /**
     * getThread provides the thread for an actor (if any).
     */
    getThread(addr: Address): Maybe<Thread> {
        return this.get(addr).map(ate => ate.thread);
    }

    /**
     * has returns true if there is an entry for the address specified.
     */
    has(addr: Address): boolean {
        return this.items.has(addr);
    }

    /**
     * set an entry in the table.
     */
    set(addr: Address, entry: ActorTableEntry): void {
        this.items.set(addr, entry);
    }

    /**
     * remove an entry from the table.
     */
    remove(addr: Address): void {
        this.items.delete(addr);
    }

    /**
     * getParent provides the [[ActorTableEntry]] given the address of an
     * actor.
     */
    getParent(addr: Address): Maybe<ActorTableEntry> {
        let parentAddress = getParent(addr);
        return this.get(parentAddress);
    }

    /**
     * getChildren provides the [[ActorTableEntry]]'s of all the children for
     * the actor with the target address.
     *
     * While the list is not sequential, actors that are children of other
     * actors in the list are guaranteed to appear after their parents.
     */
    getChildren(addr: Address): ActorTableEntry[] {
        if (!this.items.has(addr)) return [];

        let firstRun = true;
        let idx = 0;
        let maxRec = 0;
        let unsortedItems: ActorTableEntry[] = [];
        let items = [...this.items.values()];
        let init: [ActorTableEntry[], ActorTableEntry[]] = [[], []];

        while (true) {
            let result = items.reduce(
                (prev, curr: ActorTableEntry) =>
                    <[ActorTableEntry[], ActorTableEntry[]]>(
                        (isChild(addr, curr.thread.address)
                            ? [prev[0], [...prev[1], curr]]
                            : [[...prev[0], curr], prev[1]])
                    ),
                init
            );

            if (firstRun) {
                if (empty(result[1])) return result[1];

                items = result[1];

                unsortedItems = items.slice();

                addr = items[0].thread.address;

                maxRec = items.length;

                firstRun = false;
            } else {
                items = [...result[0], ...result[1]];

                idx++;

                if (idx >= maxRec) break;

                addr = unsortedItems[idx].thread.address;
            }
        }

        return items;
    }
}
