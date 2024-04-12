import * as errors from '../runtime/error';

import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { distribute, empty } from '@quenk/noni/lib/data/array';

import { Instance } from '../../..';
import { Address, isRestricted, make } from '../../../address';
import { Template } from '../../../template';
import { Thread } from '../thread';
import { Allocator } from './';
import { newContext } from '../runtime/context';
import { SharedThread } from '../thread/shared';
import { ScriptFactory } from '../scripts/factory';
import { Platform } from '..';

const MAX_WORKLOAD = 50;

/**
 * ActorTableEntry is the bookkeeping record for exactly one actor within the
 * system.
 */
export interface ActorTableEntry {
    /**
     * address for the actor.
     */
    address: Address;

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
 * MapAllocator stores actor information in a map structure where each
 * entry points to its parent and children.
 */
export class MapAllocator implements Allocator {
    constructor(
        public actors = new Map(),
        public nextAID = 1
    ) {}

    /**
     * getEntry provides the entry for an actor given its thread.
     */
    getEntry(thread: Thread): Maybe<ActorTableEntry> {
        for (let entry of this.actors.values()) {
            if (entry.thread === thread) return Maybe.of(entry);
        }

        return Maybe.nothing();
    }

    getThread(address: Address): Maybe<Thread> {
        for (let entry of this.actors.values()) {
            if (entry.address === address) return Maybe.of(entry.thread);
        }

        return Maybe.nothing();
    }

    allocate(vm: Platform, parent: Thread, tmpl: Template): Future<Address> {
        return Future.do(async () => {
            let mparentEntry = this.getEntry(parent);

            if (mparentEntry.isNothing())
                return Future.raise(new errors.InvalidThreadErr(parent));

            let parentEntry = mparentEntry.get();

            let aid = this.nextAID++;

            let consName = parentEntry.actor.constructor.name.toLowerCase();

            let id = tmpl.id ?? `instance::${consName}::aid::${aid}`;

            if (isRestricted(<string>id))
                return Future.raise(new errors.InvalidIdErr(id));

            let address = make(parentEntry.address, id);

            if (this.actors.has(address))
                return Future.raise(new errors.DuplicateAddressErr(address));

            let context = newContext(aid, address, tmpl);

            let thread = new SharedThread(
                vm,
                ScriptFactory.getScript(),
                context
            );

            let actor = tmpl.create(thread);

            let entry = {
                address,
                parent: mparentEntry,
                thread,
                actor,
                children: []
            };

            this.actors.set(address, entry);

            parentEntry.children.push(entry);

            thread.watch(() => actor.start());

            return address;
        });
    }

    deallocate(target: Thread): Future<void> {
        return Future.do(async () => {
            let mentry = this.getEntry(target);

            if (mentry.isNothing()) return;

            let entry = mentry.get();

            // Remove the subtree from the system.
            entry.parent.map(parent => {
                parent.children = parent.children.filter(
                    child => child !== entry
                );
            });

            let targets = [entry];

            let pending = entry.children.slice();

            while (!empty(pending)) {
                let target = <ActorTableEntry>pending.shift();

                pending = [...pending, ...target.children];

                targets.unshift(target);
            }

            await Future.batch(
                distribute(
                    targets.map(target =>
                        Future.do(async () => {
                            target.thread.die();

                            await target.actor.stop();

                            this.actors.delete(target.address);

                            // TODO: dispatch event
                        })
                    ),
                    MAX_WORKLOAD
                )
            );
        });
    }
}
