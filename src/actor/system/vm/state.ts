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
    contains,
    partition
} from '@quenk/noni/lib/data/record';
import { startsWith } from '@quenk/noni/lib/data/string';

import {
    ADDRESS_SYSTEM,
    Address,
    getParent as getParentAddress
} from '../../address';
import { Instance } from '../../';
import { Context, Contexts } from './runtime/context';
import { Runtime } from './runtime';

/**
 * Runtimes map.
 */
export interface Runtimes extends Record<Runtime> { }

/**
 * Routers map.
 */
export interface Routers extends Record<Address> { }

/**
 * Groups map.
 */
export interface Groups extends Record<Address[]> { }

/**
 * State contains Context entries for all actors in the system.
 */
export interface State {

    /**
     * runtimes for each actor within the system.
     */
    runtimes: Runtimes,

    /**
     * contexts for each actor in the system.
     */
    contexts: Contexts,

    /**
     * routers configured for transfers.
     */
    routers: Routers,

    /**
     * group assignments.
     */
    groups: Groups

}

/**
 * exists tests whether an address exists in the State.
 */
export const exists =
    (s: State, addr: Address): boolean => contains(s.contexts, addr);

/**
 * get a Context using an Address.
 */
export const get =
    (s: State, addr: Address): Maybe<Context> => fromNullable(s.contexts[addr]);

/**
 * put a new Context in the State.
 */
export const put =
    (s: State, addr: Address, context: Context): State => {

        s.contexts[addr] = context;
        return s;

    }

/**
 * remove an actor entry.
 */
export const remove =
    (s: State, addr: Address): State => {

        delete s.contexts[addr];

        return s;

    }

/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export const getAddress =
    (s: State, actor: Instance): Maybe<Address> =>
        reduce(s.contexts, nothing(), (p: Maybe<Address>, c, k) =>
            c.actor === actor ? fromString(k) : p);

/**
 * getChildren returns the child contexts for an address.
 */
export const getChildren =
    (s: State, addr: Address): Contexts =>
        (addr === ADDRESS_SYSTEM) ?
            s.contexts :
            <Contexts>partition(s.contexts, (_, key) =>
                (startsWith(key, addr) && key !== addr))[0];

/**
 * getParent context using an Address.
 */
export const getParent =
    (s: State, addr: Address): Maybe<Context> =>
        fromNullable(s.contexts[getParentAddress(addr)]);

/**
 * getRouter will attempt to provide the 
 * router context for an Address.
 *
 * The value returned depends on whether the given 
 * address begins with any of the installed router's address.
 */
export const getRouter =
    (s: State, addr: Address): Maybe<Context> =>
        reduce(s.routers, nothing(), (p, k) =>
            startsWith(addr, k) ? fromNullable(s.contexts[k]) : p);

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
