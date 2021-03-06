import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record } from '@quenk/noni/lib/data/record';
import { Address } from '../../address';
import { Instance } from '../../';
import { Runtime } from './runtime';
/**
 * Runtimes map.
 */
export interface Runtimes extends Record<Runtime> {
}
/**
 * Routers map.
 */
export interface Routers extends Record<Address> {
}
/**
 * Groups map.
 */
export interface Groups extends Record<Address[]> {
}
/**
 * State contains Context entries for all actors in the system.
 */
export interface State {
    /**
     * runtimes for each actor within the system.
     */
    runtimes: Runtimes;
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
export declare const exists: (s: State, addr: Address) => boolean;
/**
 * get a Runtime from the State using an address.
 */
export declare const get: (s: State, addr: Address) => Maybe<Runtime>;
/**
 * put a new Runtime in the State.
 */
export declare const put: (s: State, addr: Address, r: Runtime) => State;
/**
 * remove an actor entry.
 */
export declare const remove: (s: State, addr: Address) => State;
/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export declare const getAddress: (s: State, actor: Instance) => Maybe<Address>;
/**
 * getChildren returns the child contexts for an address.
 */
export declare const getChildren: (s: State, addr: Address) => Runtimes;
/**
 * getParent context using an Address.
 */
export declare const getParent: (s: State, addr: Address) => Maybe<Runtime>;
/**
 * getRouter will attempt to provide the
 * router context for an Address.
 *
 * The value returned depends on whether the given
 * address begins with any of the installed router's address.
 */
export declare const getRouter: (s: State, addr: Address) => Maybe<Runtime>;
/**
 * putRoute adds a route to the routing table.
 */
export declare const putRoute: (s: State, target: Address, router: Address) => State;
/**
 * removeRoute from the routing table.
 */
export declare const removeRoute: (s: State, target: Address) => State;
/**
 * removeGroup from the groups table.
 */
export declare const removeGroup: (s: State, target: Address) => State;
/**
 * getGroup attempts to provide the addresses of actors that have
 * been assigned to a group.
 *
 * Note that groups must be prefixed with a '$' to be resolved.
 */
export declare const getGroup: (s: State, name: string) => Maybe<Address[]>;
/**
 * putMember adds an address to a group.
 *
 * If the group does not exist, it will be created.
 */
export declare const putMember: (s: State, group: string, member: Address) => State;
/**
 * removeMember from a group.
 */
export declare const removeMember: (s: State, group: string, member: Address) => State;
