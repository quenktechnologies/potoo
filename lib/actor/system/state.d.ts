import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Address } from '../address';
import { Instance } from '../';
import { Context, Contexts } from '../context';
/**
 * Routers map.
 */
export interface Routers {
    [key: string]: Address;
}
/**
 * Groups map.
 */
export interface Groups {
    [key: string]: Address[];
}
/**
 * State contains Context entries for all actors in the system.
 */
export interface State {
    /**
     * contexts for each actor in the system.
     */
    contexts: Contexts;
    /**
     * routers configured for transfers.
     */
    routers: Routers;
    /**
     * group assignments.
     */
    groups: Groups;
}
/**
 * exists tests whether an address exists in the State.
 */
export declare const exists: (s: State, addr: string) => boolean;
/**
 * get a Context using an Address.
 */
export declare const get: (s: State, addr: string) => Maybe<Context>;
/**
 * put a new Context in the State.
 */
export declare const put: (s: State, addr: string, context: Context) => State;
/**
 * remove an actor entry.
 */
export declare const remove: (s: State, addr: string) => State;
/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export declare const getAddress: (s: State, actor: Instance) => Maybe<string>;
/**
 * getChildren returns the child contexts for an address.
 */
export declare const getChildren: (s: State, addr: string) => Contexts;
/**
 * getParent context using an Address.
 */
export declare const getParent: (s: State, addr: string) => Maybe<Context>;
/**
 * getRouter will attempt to provide the
 * router context for an Address.
 *
 * The value returned depends on whether the given
 * address begins with any of the installed router's address.
 */
export declare const getRouter: (s: State, addr: string) => Maybe<Context>;
/**
 * putRoute adds a route to the routing table.
 */
export declare const putRoute: (s: State, target: string, router: string) => State;
/**
 * removeRoute from the routing table.
 */
export declare const removeRoute: (s: State, target: string) => State;
/**
 * getGroup attempts to provide the addresses of actors that have
 * been assigned to a group.
 *
 * Note that groups must be prefixed with a '$' to be resolved.
 */
export declare const getGroup: (s: State, name: string) => Maybe<string[]>;
/**
 * putMember adds an address to a group.
 *
 * If the group does not exist, it will be created.
 */
export declare const putMember: (s: State, group: string, member: string) => State;
/**
 * removeMember from a group.
 */
export declare const removeMember: (s: State, group: string, member: string) => State;
