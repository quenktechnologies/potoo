import {
    Maybe,
    fromString,
    fromNullable,
    fromArray,
    just,
    nothing
} from '@quenk/noni/lib/data/maybe';
import { reduce, contains, partition } from '@quenk/noni/lib/data/record';
import { startsWith } from '@quenk/noni/lib/data/string';
import { Actor, Behaviour } from '../../';
import { Template } from '../../template';
import { Envelope } from '../mailbox';
import { ADDRESS_SYSTEM, Address, getParent as getParentAddress } from '../../address';
import { Context, Contexts } from './context';

/**
 * Routes map.
 */
export interface Routes {

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
     * routes configured for transfers.
     */
    routes: Routes

}

/**
 * exists tests whether an address exists in the State.
 */
export const exists = <C extends Context>(s: State<C>, addr: Address): boolean =>
    contains(s.contexts, addr);

/**
 * get a Context using an Address.
 */
export const get = <C extends Context>(s: State<C>, addr: Address): Maybe<C> =>
    fromNullable(s.contexts[addr]);

/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export const getAddress =
    <C extends Context>(s: State<C>, actor: Actor): Maybe<Address> =>
        reduce(s.contexts, nothing(),
            (p: Maybe<Address>, c, k) => c.actor === actor ?
                fromString(k) : p);

/**
 * getInstance attempts to retrieve an actor given its address.
 */
export const getInstance =
    <C extends Context>(s: State<C>, addr: Address): Maybe<Actor> =>
        reduce(s.contexts, nothing(),
            (p: Maybe<Actor>, c, k) => k === addr ?
                fromNullable(c.actor) : p);

/**
 * getTemplate attempts to retrieve the template for an
 * actor given an address.
 */
export const getTemplate =
    <C extends Context>(s: State<C>, addr: Address): Maybe<Template> =>
        get(s, addr).map(f => f.template);

/**
 * getMessage attempts to retrieve the next message
 * from an actors mailbox.
 *
 * If sucessfull, the message will be removed.
 */
export const getMessage =
    <C extends Context>(s: State<C>, addr: Address): Maybe<Envelope> =>
        get(s, addr)
            .chain(f => f.mailbox)
            .chain(m => fromArray(m))
            .map(m => <Envelope>m.shift());

/**
 * getBehaviour attempts to retrieve the behaviour for an 
 * actor given an address.
 */
export const getBehaviour =
    <C extends Context>(s: State<C>, addr: Address): Maybe<Behaviour> =>
        get(s, addr)
            .chain(f => fromArray(f.behaviour))
            .map(b => b[0]);

/**
 * getChildren returns the child contexts for an address.
 */
export const getChildren =
    <C extends Context>(s: State<C>, addr: Address): Contexts<C> =>
        (addr === ADDRESS_SYSTEM) ?
            s.contexts :
            <Contexts<C>>partition(s.contexts)((_, key) =>
                (startsWith(key, addr) && key !== addr))[0];

/**
 * getParent context using an Address.
 */
export const getParent =
    <C extends Context>(s: State<C>, addr: Address): Maybe<C> =>
        fromNullable(s.contexts[getParentAddress(addr)]);

/**
 * getRouter will attempt to provide the 
 * routing actor for an Address.
 *
 * The value returned depends on whether the given 
 * address begins with any of the installed router's address.
 */
export const getRouter =
    <C extends Context>(s: State<C>, addr: Address): Maybe<Address> =>
        reduce(s.routes, nothing(), (p, k) =>
            startsWith(addr, k) ? just(k) : p);

/**
 * put a new Context in the State.
 */
export const put =
    <C extends Context>(s: State<C>, addr: Address, context: C): State<C> => {

        s.contexts[addr] = context;
        return s;

    }

/**
 * putRoute adds a route to the routing table.
 */
export const putRoute =
    <C extends Context>(s: State<C>, from: Address, to: Address): State<C> => {

        s.routes[from] = to;
        return s;

    }

/**
 * remove an actor entry.
 */
export const remove =
    <C extends Context>(s: State<C>, addr: Address): State<C> => {

        delete s.contexts[addr];

        return s;

    }

/**
 * runInstance attempts to invoke the run code of an actor instance.
 */
export const runInstance =
    <C extends Context>(s: State<C>, addr: Address): void => {

        getInstance(s, addr).map(a => a.run());

    }
