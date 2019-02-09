import {
    Maybe,
    fromString,
    fromNullable,
    nothing
} from '@quenk/noni/lib/data/maybe';
import { reduce, contains, partition } from '@quenk/noni/lib/data/record';
import { startsWith } from '@quenk/noni/lib/data/string';
import { Runtime } from './vm/runtime';
import { Instance } from '../';
import { ADDRESS_SYSTEM, Address, getParent as getParentAddress } from '../address';
import { Context, Contexts } from '../context';
import { System } from './';

/**
 * Routers map.
 */
export interface Routers {

    [key: string]: Address

}

/**
 * State contains Context entries for all actors in the system.
 */
export interface State<C extends Context> {

    /**
     * contexts for each actor in the system.
     */
    contexts: Contexts<C>,

    /**
     * routers configured for transfers.
     */
    routers: Routers

}

/**
 * exists tests whether an address exists in the State.
 */
export const exists = <C extends Context>
    (s: State<C>, addr: Address): boolean => contains(s.contexts, addr);

/**
 * get a Context using an Address.
 */
export const get = <C extends Context>
    (s: State<C>, addr: Address): Maybe<C> => fromNullable(s.contexts[addr]);

/**
 * put a new Context in the State.
 */
export const put = <C extends Context>
    (s: State<C>, addr: Address, context: C): State<C> => {

    s.contexts[addr] = context;
    return s;

}

/**
 * remove an actor entry.
 */
export const remove = <C extends Context>
    (s: State<C>, addr: Address): State<C> => {

    delete s.contexts[addr];

    return s;

}

/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export const getAddress = <C extends Context>
    (s: State<C>, actor: Instance): Maybe<Address> =>
    reduce(s.contexts, nothing(), (p: Maybe<Address>, c, k) =>
        c.actor === actor ? fromString(k) : p);

/**
 * getRuntime attempts to retrieve the runtime for an Actor instance.
 */
export const getRuntime = <C extends Context>
    (s: State<C>, actor: Instance): Maybe<Runtime<Context, System<Context>>> =>
    reduce(s.contexts, nothing(), (p, c) =>
        c.actor === actor ? fromNullable(c.runtime) : p);

/**
 * getChildren returns the child contexts for an address.
 */
export const getChildren = <C extends Context>
    (s: State<C>, addr: Address): Contexts<C> =>
    (addr === ADDRESS_SYSTEM) ?
        s.contexts :
        <Contexts<C>>partition(s.contexts)((_, key) =>
            (startsWith(key, addr) && key !== addr))[0];

/**
 * getParent context using an Address.
 */
export const getParent = <C extends Context>
    (s: State<C>, addr: Address): Maybe<C> =>
    fromNullable(s.contexts[getParentAddress(addr)]);

/**
 * getRouter will attempt to provide the 
 * routing actor for an Address.
 *
 * The value returned depends on whether the given 
 * address begins with any of the installed router's address.
 */
export const getRouter = <C extends Context>
    (s: State<C>, addr: Address): Maybe<C> =>
    reduce(s.routers, nothing(), (p, k) =>
        startsWith(addr, k) ? fromNullable(s.contexts[k]) : p);

/**
 * putRoute adds a route to the routing table.
 */
export const putRoute = <C extends Context>
    (s: State<C>, target: Address, router: Address): State<C> => {

    s.routers[target] = router;
    return s;

}

/**
 * removeRoute from the routing table.
 */
export const removeRoute = <C extends Context>(s: State<C>, target: Address)
    : State<C> => {

    delete s.routers[target];
    return s;

}
