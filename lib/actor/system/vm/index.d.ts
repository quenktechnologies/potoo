import * as template from '../../template';
import * as events from './event';
import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Either } from '@quenk/noni/lib/data/either';
import { Address } from '../../address';
import { Template } from '../../template';
import { Message } from '../../message';
import { Instance, Actor } from '../../';
import { System } from '../';
import { SharedScheduler } from './thread/shared/scheduler';
import { Context } from './runtime/context';
import { Data } from './runtime/stack/frame';
import { Conf } from './conf';
import { LogWritable, LogWriter } from './log';
import { HeapLedger, DefaultHeapLedger } from './runtime/heap/ledger';
import { Foreign } from './type';
import { EventSource } from './event';
import { GroupMap } from './groups';
import { ActorTable } from './table';
import { RouterMap } from './routers';
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
     * log service for the VM.
     *
     * Used to access the internal logging API.
     */
    log: LogWritable;
    /**
     * events service for the VM.
     *
     * Used to publish VM events to interested listeners.
     */
    events: EventSource;
    /**
     * actors holds all the actors within the system at any given point along
     * with needed bookkeeping information.
     */
    actors: ActorTable;
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
    _context: Context;
    /**
     * scheduler shared between vm threads.
     */
    scheduler: SharedScheduler;
    heap: DefaultHeapLedger;
    log: LogWriter;
    events: events.Publisher;
    actors: ActorTable;
    /**
     * routers configured to handle any address that falls underneath them.
     */
    routers: RouterMap;
    /**
     * groups combine multiple addresses into one.
     */
    groups: GroupMap;
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
    raise(src: Instance, err: Err): void;
    kill(parent: Instance, target: Address): Future<void>;
    /**
     * tell allows the vm to send a message to another actor via opcodes.
     *
     * If you want to immediately deliver a message, use [[sendMessage]] instead.
     */
    tell<M>(ref: Address, msg: M): PVM;
    exec(actor: Instance, funName: string, args?: Foreign[]): void;
}
