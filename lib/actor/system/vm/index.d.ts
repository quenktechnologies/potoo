import * as template from '../../template';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Address } from '../../address';
import { Instance } from '../../';
import { System } from '../';
import { Context, ErrorHandler } from './runtime/context';
import { State } from './state';
import { Runtime } from './runtime';
import { Script, PVM_Value } from './script';
/**
 * Slot
 */
export declare type Slot = [Address, Script, Runtime];
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
    constructor(system: S);
    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State;
    /**
     * queue of scripts to be executed by the system in order.
     */
    queue: Slot[];
    running: boolean;
    raise(_: Err): void;
    allocate(addr: Address, t: template.Template<System>): Context;
    getContext(addr: Address): Maybe<Context>;
    getRouter(addr: Address): Maybe<Context>;
    putContext(addr: Address, ctx: Context): PVM<S>;
    putMember(group: string, addr: Address): PVM<S>;
    putRoute(target: Address, router: Address): PVM<S>;
    removeRoute(target: Address): PVM<S>;
    exec(i: Instance, s: Script): Maybe<PVM_Value>;
}
