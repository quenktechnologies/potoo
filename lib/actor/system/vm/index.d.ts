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
import { SharedScheduler } from './thread/shared/scheduler';
import { Thread, VMThread } from './thread';
import { State, Threads } from './state';
import { Script } from './script';
import { Context } from './runtime/context';
import { Data, Frame } from './runtime/stack/frame';
import { Opcode } from './runtime/op';
import { Operand } from './runtime';
import { Conf } from './conf';
import { HeapLedger, DefaultHeapLedger } from './runtime/heap/ledger';
import { Foreign } from './type';
/**
 * Slot
 */
export declare type Slot = [Address, Script, Thread];
export declare const MAX_WORK_LOAD = 25;
/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends Actor {
    /**
     * heap storage with builtin ownership tracking for all threads.
     */
    heap: HeapLedger;
    /**
     * allocate a new Thread for an actor.
     *
     * It is an error if a Thread has already been allocated for the actor.
     */
    allocate(self: Address, t: template.Template): Either<Err, Address>;
    /**
     * sendMessage to an actor in the system.
     *
     * The result is true if the actor was found or false
     * if the actor is not in the system.
     */
    sendMessage(to: Address, from: Address, msg: Message): boolean;
    /**
     * getThread from the system given its address.
     */
    getThread(addr: Address): Maybe<Thread>;
    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>;
    /**
     * getGroup attempts to retrieve all the members of a group.
     */
    getGroup(name: string): Maybe<Address[]>;
    /**
     * getChildren provides the children contexts for an address.
     */
    getChildren(addr: Address): Maybe<Threads>;
    /**
     * putThread in the system at the specified address.
     */
    putThread(addr: Address, r: Thread): Platform;
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
     * remove a Thread from the system.
     */
    remove(addr: Address): Platform;
    /**
     * removeRoute configuration.
     */
    removeRoute(target: Address): Platform;
    /**
     * spawn an actor using the given Instance as the parent.
     *
     * The Instance is required to verify if it is still part of the system.
     */
    spawn(parent: Instance, tmpl: template.Spawnable): Address;
    /**
     * identify an actor Instance producing its address if it is part of the
     * system.
     */
    identify(target: Instance): Maybe<Address>;
    /**
     * kill terminates the actor at the specified address.
     *
     * The actor must be a child of parent to succeed.
     */
    kill(parent: Instance, target: Address): Future<void>;
    /**
     * raise an exception within the system
     */
    raise(src: Instance, err: Err): void;
    /**
     * trigger is used to generate events as the system runs.
     */
    trigger(addr: Address, evt: string, ...args: Type[]): void;
    /**
     * logOp is used by Thread to log which opcodes are executed.
     */
    logOp(r: VMThread, f: Frame, op: Opcode, operand: Operand): void;
    /**
     * exec a function by name with the provided arguments using the actor
     * instance's thread.
     */
    exec(actor: Instance, funName: string, args?: Data[]): void;
}
/**
 * PVM (Potoo Virtual Machine) is a JavaScript implemented virtual machine that
 * functions as a message delivery system between target actors.
 *
 * Actors known to the VM are considered to be part of a system and may or may
 * not reside on the same process/worker/thread depending on the underlying
 * platform and individual actor implementations.
 */
export declare class PVM implements Platform {
    system: System;
    conf: Conf;
    constructor(system: System, conf?: Conf);
    _actorIdCounter: number;
    /**
     * heap memory shared between actor Threads.
     */
    heap: DefaultHeapLedger;
    /**
     * threadRunner shared between vm threads.
     */
    threadRunner: SharedScheduler;
    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State;
    /**
     * Create a new PVM instance using the provided System implementation and
     * configuration object.
     */
    static create<S extends System>(s: S, conf?: object): PVM;
    init(c: Context): Context;
    accept(m: Message): import("../../").Eff;
    start(): void;
    notify(): void;
    stop(): Future<void>;
    identify(inst: Instance): Maybe<Address>;
    spawn(parent: Instance, tmpl: template.Spawnable): Address;
    _spawn(parent: Address, tmpl: Template): Address;
    allocate(parent: Address, tmpl: Template): Either<Err, Address>;
    runActor(target: Address): Future<unknown> | undefined;
    sendMessage(to: Address, from: Address, msg: Message): boolean;
    getThread(addr: Address): Maybe<Thread>;
    getRouter(addr: Address): Maybe<Context>;
    getGroup(name: string): Maybe<Address[]>;
    getChildren(addr: Address): Maybe<Threads>;
    putThread(addr: Address, r: Thread): PVM;
    putMember(group: string, addr: Address): PVM;
    putRoute(target: Address, router: Address): PVM;
    remove(addr: Address): PVM;
    removeRoute(target: Address): PVM;
    raise(src: Instance, err: Err): void;
    trigger(addr: Address, evt: string, ...args: Type[]): void;
    logOp(r: VMThread, f: Frame, op: Opcode, oper: Operand): void;
    kill(parent: Instance, target: Address): Future<void>;
    /**
     * tell allows the vm to send a message to another actor via opcodes.
     *
     * If you want to immediately deliver a message, use [[sendMessage]] instead.
     */
    tell<M>(ref: Address, msg: M): PVM;
    exec(actor: Instance, funName: string, args?: Foreign[]): void;
}
