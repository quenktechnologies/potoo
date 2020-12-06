import * as template from '../../template';
import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Either } from '@quenk/noni/lib/data/either';
import { Type } from '@quenk/noni/lib/data/type';
import { Address } from '../../address';
import { Template } from '../../template';
import { Message } from '../../message';
import { Instance, Actor } from '../../';
import { System } from '../';
import { State, Runtimes } from './state';
import { Script } from './script';
import { Context } from './runtime/context';
import { Runtime, Operand } from './runtime';
import { Conf } from './conf';
import { Frame } from './runtime/stack/frame';
import { Opcode } from './runtime/op';
import { PTValue } from './type';
/**
 * Slot
 */
export declare type Slot = [Address, Script, Runtime];
export declare const MAX_WORK_LOAD = 25;
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
     * runActor provides a Future that when fork()'d will execute the
     * start code/method for the target actor.
     *
     */
    runActor(target: Address): Future<void>;
    /**
     * sendMessage to an actor in the system.
     *
     * The result is true if the actor was found or false
     * if the actor is not in the system.
     */
    sendMessage(to: Address, from: Address, msg: PTValue): boolean;
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
     *
     * The actor must be a child of parent to succeed.
     */
    kill(parent: Address, target: Address): Future<void>;
    /**
     * raise does the error handling on behalf of Runtimes.
     */
    raise(addr: Address, err: Err): void;
    /**
     * trigger is used to generate events as the system runs.
     */
    trigger(addr: Address, evt: string, ...args: Type[]): void;
    /**
     * logOp is used by Runtimes to log which opcodes are executed.
     */
    logOp(r: Runtime, f: Frame, op: Opcode, operand: Operand): void;
    /**
     * runTask executes an async operation on behalf of a Runtime.
     */
    runTask(addr: Address, ft: Future<void>): void;
}
/**
 * PVM is the Potoo Virtual Machine.
 */
export declare class PVM implements Platform, Actor {
    system: System;
    conf: Conf;
    constructor(system: System, conf?: Conf);
    static create<S extends System>(s: S, conf: object): PVM;
    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State;
    /**
     * runQ is the queue of pending Scripts to be executed.
     */
    runQ: Slot[];
    /**
     * waitQ is the queue of pending Scripts for Runtimes that are awaiting
     * the completion of an async task.
     */
    waitQ: Slot[];
    /**
     * blocked is a
     */
    blocked: Address[];
    running: boolean;
    init(c: Context): Context;
    accept(_: Message): void;
    start(): void;
    notify(): void;
    stop(): Future<void>;
    allocate(parent: Address, t: Template<System>): Either<Err, Address>;
    runActor(target: Address): Future<void>;
    runTask(addr: Address, ft: Future<void>): void;
    sendMessage(to: Address, from: Address, m: PTValue): boolean;
    getRuntime(addr: Address): Maybe<Runtime>;
    getRouter(addr: Address): Maybe<Context>;
    getGroup(name: string): Maybe<Address[]>;
    getChildren(addr: Address): Maybe<Runtimes>;
    putRuntime(addr: Address, r: Runtime): PVM;
    putMember(group: string, addr: Address): PVM;
    putRoute(target: Address, router: Address): PVM;
    remove(addr: Address): PVM;
    removeRoute(target: Address): PVM;
    raise(addr: Address, err: Err): void;
    trigger(addr: Address, evt: string, ...args: Type[]): void;
    logOp(r: Runtime, f: Frame, op: Opcode, oper: Operand): void;
    kill(parent: Address, target: Address): Future<void>;
    /**
     * spawn an actor.
     *
     * This actor will be a direct child of the root.
     */
    spawn(t: Template<System>): Address;
    execNow(i: Instance, s: Script): Maybe<PTValue>;
    exec(i: Instance, s: Script): void;
    run(): void;
}
