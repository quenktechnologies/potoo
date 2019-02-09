import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Runtime } from './vm/runtime';
import { Instance } from '../';
import { Address } from '../address';
import { Context, Contexts } from '../context';
import { System } from './';
/**
 * Routers map.
 */
export interface Routers {
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
     * routers configured for transfers.
     */
    routers: Routers;
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
 * put a new Context in the State.
 */
export declare const put: <C extends Context>(s: State<C>, addr: string, context: C) => State<C>;
/**
 * remove an actor entry.
 */
export declare const remove: <C extends Context>(s: State<C>, addr: string) => State<C>;
/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export declare const getAddress: <C extends Context>(s: State<C>, actor: Instance) => Maybe<string>;
/**
 * getRuntime attempts to retrieve the runtime for an Actor instance.
 */
export declare const getRuntime: <C extends Context>(s: State<C>, actor: Instance) => Maybe<Runtime<Context, System<Context>>>;
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
export declare const getRouter: <C extends Context>(s: State<C>, addr: string) => Maybe<C>;
/**
 * putRoute adds a route to the routing table.
 */
export declare const putRoute: <C extends Context>(s: State<C>, target: string, router: string) => State<C>;
/**
 * removeRoute from the routing table.
 */
export declare const removeRoute: <C extends Context>(s: State<C>, target: string) => State<C>;
