import {
    Maybe,
    fromString,
    fromNullable,
    fromArray,
    nothing
} from '@quenk/noni/lib/data/maybe';
import {
    Record,
    reduce,
    hasKey,
    partition,
    exclude
} from '@quenk/noni/lib/data/record';
import { startsWith } from '@quenk/noni/lib/data/string';

import {
    ADDRESS_SYSTEM,
    Address,
    getParent as getParentAddress
} from '../../address';
import { Message } from '../../message';
import { Instance } from '../../';
import { Thread } from './thread';

/**
 * Threads map.
 */
export interface Threads extends Record<Thread> { }

/**
 * Routers map.
 */
export interface Routers extends Record<Address> { }

/**
 * Groups map.
 */
export interface Groups extends Record<Address[]> { }

/**
 * PendingMessages map.
 */
export interface PendingMessages extends Record<Message[]> { }

/**
 * State contains Context entries for all actors in the system.
 */
export interface State {

    /**
     * threads for each actor within the system.
     */
    threads: Threads,

    /**
     * routers configured for transfers.
     */
    routers: Routers,

    /**
     * group assignments.
     */
    groups: Groups

    /**
     * pendingMessages is a Message buffer for actors that have not been fully
     * initialized yet.
     */
    pendingMessages: PendingMessages

}

/**
 * exists tests whether an address exists in the State.
 */
export const exists =
    (s: State, addr: Address): boolean => hasKey(s.threads, addr);

/**
 * get a Thread from the State using an address.
 */
export const get =
    (s: State, addr: Address): Maybe<Thread> => fromNullable(s.threads[addr]);

/**
 * put a new Thread in the State.
 */
export const put =
    (s: State, addr: Address, r: Thread): State => {

        s.threads[addr] = r;
        return s;

    }

/**
 * remove an actor entry.
 */
export const remove =
    (s: State, addr: Address): State => {

        delete s.threads[addr];

        return s;

    }

/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export const getAddress =
    (s: State, actor: Instance): Maybe<Address> =>
        reduce(s.threads, nothing(), (p: Maybe<Address>, c, k) =>
            c.context.actor === actor ? fromString(k) : p);

/**
 * getChildren returns the child contexts for an address.
 */
export const getChildren =
    (s: State, addr: Address): Threads =>
        (addr === ADDRESS_SYSTEM) ?
            exclude(s.threads, ADDRESS_SYSTEM) :
            <Threads>partition(s.threads, (_, key) =>
                (startsWith(key, addr) && key !== addr))[0];

/**
 * getParent context using an Address.
 */
export const getParent =
    (s: State, addr: Address): Maybe<Thread> =>
        fromNullable(s.threads[getParentAddress(addr)]);

/**
 * getRouter will attempt to provide the 
 * router context for an Address.
 *
 * The value returned depends on whether the given 
 * address begins with any of the installed router's address.
 */
export const getRouter =
    (s: State, addr: Address): Maybe<Thread> =>
        reduce(s.routers, nothing(), (p, k) =>
            startsWith(addr, k) ? fromNullable(s.threads[k]) : p);

/**
 * putRoute adds a route to the routing table.
 */
export const putRoute =
    (s: State, target: Address, router: Address): State => {

        s.routers[target] = router;
        return s;

    }

/**
 * removeRoute from the routing table.
 */
export const removeRoute = (s: State, target: Address)
    : State => {

    delete s.routers[target];
    return s;

}

/**
 * removeGroup from the groups table.
 */
export const removeGroup = (s: State, target: Address)
    : State => {

    delete s.groups[target];
    return s;

}

/**
 * getGroup attempts to provide the addresses of actors that have
 * been assigned to a group.
 *
 * Note that groups must be prefixed with a '$' to be resolved.
 */
export const getGroup =
    (s: State, name: string): Maybe<Address[]> =>
        s.groups.hasOwnProperty(name) ?
            fromArray(<string[]>s.groups[name]) : nothing();

/**
 * putMember adds an address to a group.
 *
 * If the group does not exist, it will be created.
 */
export const putMember =
    (s: State, group: string, member: Address): State => {

        if (s.groups[group] == null)
            s.groups[group] = [];

        s.groups[group].push(member);

        return s;

    }

/**
 * removeMember from a group.
 */
export const removeMember =
    (s: State, group: string, member: Address): State => {

        if (s.groups[group] != null)
            s.groups[group] = s.groups[group].filter(m => m != member);

        return s;

    }

/**
 * createMessageBuffer creates a temporary message buffer for the actor address.
 */
export const createMessageBuffer = (s: State, addr: Address): State => {
    s.pendingMessages[addr] = [];
    return s;
}

/**
 * destroyMessageBuffer removes the message buffer (if any) for the provided
 * address.
 */
export const destroyMessageBuffer = (s: State, addr: Address): State => {
    delete s.pendingMessages[addr];
    return s;
}
