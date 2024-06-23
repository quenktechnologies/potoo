import * as errors from '../runtime/error';

import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { distribute, empty } from '@quenk/noni/lib/data/array';

import { Address, isRestricted, make } from '../../../address';
import { Template } from '../../../template';
import { SharedThread } from '../thread/shared';
import { Thread } from '../thread';
import { Actor } from '../../..';
import { Platform } from '..';
import { Allocator } from './';

const MAX_THREAD_KILL_PER_CYCLE = 25;

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
     * template used to create the actor.
     */
    template: Template;

    /**
     * actor instance for the entry.
     */
    actor: Actor;

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
        public platform: () => Platform,
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

    getTemplate(address: Address): Maybe<Template> {
        return Maybe.fromNullable(this.actors.get(address)).map(
            (entry: ActorTableEntry) => entry.template
        );
    }

    async allocate(parent: Thread, template: Template): Promise<Address> {
        let mparentEntry = this.getEntry(parent);

        if (mparentEntry.isNothing())
            return Future.raise(new errors.InvalidThreadErr(parent));

        let parentEntry = mparentEntry.get();

        let aid = this.nextAID++;

        let consName = parentEntry.actor.constructor.name.toLowerCase();

        let id = template.id ?? `instance::${consName}::aid::${aid}`;

        if (isRestricted(<string>id))
            return Future.raise(new errors.InvalidIdErr(id));

        let address = make(parentEntry.address, id);

        if (this.actors.has(address))
            return Future.raise(new errors.DuplicateAddressErr(address));

        let thread = new SharedThread(this.platform(), address);

        // XXX: Note a rejected promise here will crash the system.
        let returnedActor = template.create && (await template.create(thread));

        let actor = returnedActor ?? thread;

        let entry = {
            address,
            parent: mparentEntry,
            thread,
            template,
            actor: actor ?? thread,
            children: []
        };

        this.actors.set(address, entry);

        parentEntry.children.push(entry);

        thread.watch(() => actor.start());

        return address;
    }

    async reallocate(target: Thread): Promise<void> {
        let mentry = this.getEntry(target);

        //TODO: dispatch event and ignore?
        if (mentry.isNothing())
            return Future.raise(new errors.InvalidThreadErr(target));

        let entry = mentry.get();

        await this.deallocate(entry.thread);

        let mparent = entry.parent;

        // TODO: dispatch event and ignore instead?
        if (mparent.isNothing())
            return Future.raise(new errors.UnknownAddressErr(target.address));

        await this.allocate(mparent.get().thread, entry.template);
    }

    async deallocate(target: Thread): Promise<void> {
        let mentry = this.getEntry(target);

        if (mentry.isNothing()) return; //TODO: dispatch event

        let entry = mentry.get();

        // Remove the subtree from the system.
        entry.parent.map(parent => {
            parent.children = parent.children.filter(child => child !== entry);
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
                        await target.actor.stop();

                        target.thread.die();

                        this.actors.delete(target.address);

                        // TODO: dispatch event
                    })
                ),
                MAX_THREAD_KILL_PER_CYCLE
            )
        );
    }
}
