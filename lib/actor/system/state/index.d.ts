import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Actor, Behaviour } from '../../';
import { Template } from '../../template';
import { Envelope } from '../mailbox';
import { Address } from '../../address';
import { Context, Contexts } from './context';
/**
 * Routes map.
 */
export interface Routes {
    [key: string]: Address;
}
/**
 * State contains Context entries for all actors in the system.
 */
export interface State<C extends Context> {
    /**
     * contexts for each actor in the system.
     */
    contexts: Contexts<C>;
    /**
     * routes configured for transfers.
     */
    routes: Routes;
}
/**
 * exists tests whether an address exists in the State.
 */
export declare const exists: <C extends Context>(s: State<C>, addr: string) => boolean;
/**
 * get a Context using an Address.
 */
export declare const get: <C extends Context>(s: State<C>, addr: string) => Maybe<C>;
/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export declare const getAddress: <C extends Context>(s: State<C>, actor: Actor) => Maybe<string>;
/**
 * getInstance attempts to retrieve an actor given its address.
 */
export declare const getInstance: <C extends Context>(s: State<C>, addr: string) => Maybe<Actor>;
/**
 * getTemplate attempts to retrieve the template for an
 * actor given an address.
 */
export declare const getTemplate: <C extends Context>(s: State<C>, addr: string) => Maybe<Template>;
/**
 * getMessage attempts to retrieve the next message
 * from an actors mailbox.
 *
 * If sucessfull, the message will be removed.
 */
export declare const getMessage: <C extends Context>(s: State<C>, addr: string) => Maybe<Envelope>;
/**
 * getBehaviour attempts to retrieve the behaviour for an
 * actor given an address.
 */
export declare const getBehaviour: <C extends Context>(s: State<C>, addr: string) => Maybe<Behaviour>;
/**
 * getChildren returns the child contexts for an address.
 */
export declare const getChildren: <C extends Context>(s: State<C>, addr: string) => Contexts<C>;
/**
 * getParent context using an Address.
 */
export declare const getParent: <C extends Context>(s: State<C>, addr: string) => Maybe<C>;
/**
 * getRouter will attempt to provide the
 * routing actor for an Address.
 *
 * The value returned depends on whether the given
 * address begins with any of the installed router's address.
 */
export declare const getRouter: <C extends Context>(s: State<C>, addr: string) => Maybe<string>;
/**
 * put a new Context in the State.
 */
export declare const put: <C extends Context>(s: State<C>, addr: string, context: C) => State<C>;
/**
 * putRoute adds a route to the routing table.
 */
export declare const putRoute: <C extends Context>(s: State<C>, from: string, to: string) => State<C>;
/**
 * remove an actor entry.
 */
export declare const remove: <C extends Context>(s: State<C>, addr: string) => State<C>;
/**
 * runInstance attempts to invoke the run code of an actor instance.
 */
export declare const runInstance: <C extends Context>(s: State<C>, addr: string) => void;
