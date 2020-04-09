import * as template from '../../template';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Either } from '@quenk/noni/lib/data/either';
import { Address } from '../../address';
import { Template } from '../../template';
import { Message } from '../../message';
import { Instance } from '../../';
import { System } from '../';
import { State, Runtimes } from './state';
import { Script, PVM_Value } from './script';
import { Context } from './runtime/context';
import { Runtime } from './runtime';
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
export interface Platform {
    /**
     * allocate a new Runtime for an actor.
     *
     * It is an error if a Runtime has already been allocated for the actor.
     */
    allocate(self: Address, t: template.Template<System>): Either<Err, Address>;
    /**
     * runActor triggers the run code/method for an actor in the system.
     *
     * It is an error if the actor does not exist.
     */
    runActor(target: Address): Either<Err, void>;
    /**
     * sendMessage to an actor in the system.
     *
     * The result is true if the actor was found or false
     * if the actor is not in the system.
     */
    sendMessage(to: Address, msg: Message): boolean;
    /**
     * getRuntime from the system given its address.
     */
    getRuntime(addr: Address): Maybe<Runtime>;
    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>;
    /**
     * getGroup attemps to retreive all the members of a group.
     */
    getGroup(name: string): Maybe<Address[]>;
    /**
     * getChildren provides the children contexts for an address.
     */
    getChildren(addr: Address): Maybe<Runtimes>;
    /**
     * putRuntime in the system at the specified address.
     */
    putRuntime(addr: Address, r: Runtime): Platform;
    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Platform;
    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Platform;
    /**
     * remove a Runtime from the system.
     */
    remove(addr: Address): Platform;
    /**
     * removeRoute configuration.
     */
    removeRoute(target: Address): Platform;
    /**
     * kill terminates the actor at the specified address.
     */
    kill(addr: Address): void;
    /**
     * raise does the error handling on behalf of Runtimes.
     */
    raise(addr: Address, err: Err): void;
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
    allocate(parent: Address, t: Template<System>): Either<Err, Address>;
    runActor(target: Address): Either<Err, void>;
    sendMessage(to: Address, msg: Message): boolean;
    getRuntime(addr: Address): Maybe<Runtime>;
    getRouter(addr: Address): Maybe<Context>;
    getGroup(name: string): Maybe<Address[]>;
    getChildren(addr: Address): Maybe<Runtimes>;
    putRuntime(addr: Address, r: Runtime): PVM<S>;
    putMember(group: string, addr: Address): PVM<S>;
    putRoute(target: Address, router: Address): PVM<S>;
    remove(addr: Address): PVM<S>;
    removeRoute(target: Address): PVM<S>;
    raise(addr: Address, err: Err): void;
    kill(addr: Address): void;
    exec(i: Instance, s: Script): Maybe<PVM_Value>;
}
