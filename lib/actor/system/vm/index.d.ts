import * as template from '../../template';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Context, ErrorHandler } from '../../context';
import { Address } from '../../address';
import { State } from '../state';
import { Configuration } from '../configuration';
import { Instance } from '../../';
import { System } from '../';
import { Runtime } from './runtime';
import { Script } from './script';
/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends ErrorHandler {
    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<System>): Context;
    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<Context>;
    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>;
    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: Context): Platform;
    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Platform;
    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Platform;
}
/**
 * PVM is the Potoo Virtual Machine.
 */
export declare class PVM<S extends System> implements Platform {
    system: S;
    config: Configuration;
    constructor(system: S, config: Configuration);
    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State;
    /**
     * pending scripts to execute.
     */
    pending: Runtime[];
    raise(_: Err): void;
    allocate(addr: Address, t: template.Template<System>): Context;
    getContext(addr: Address): Maybe<Context>;
    getRouter(addr: Address): Maybe<Context>;
    putContext(addr: Address, ctx: Context): PVM<S>;
    putMember(group: string, addr: Address): PVM<S>;
    putRoute(target: Address, router: Address): PVM<S>;
    removeRoute(target: Address): PVM<S>;
    exec(_i: Instance, _s: Script): void;
}
