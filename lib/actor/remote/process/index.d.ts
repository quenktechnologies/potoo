/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';
import { Context } from '../../system/vm/runtime/context';
import { Case } from '../../resident/case';
import { System } from '../../system';
import { Envelope } from '../../mailbox';
import { Address } from '../../address';
import { Actor } from '../../';
export declare const SCRIPT_PATH: string;
/**
 * Path to the actor process.
 */
export declare type Path = string;
/**
 * Handle to a node process.
 *
 * This is declared here to limit it to the used methods.
 */
export interface Handle {
    /**
     * send a message to the process.
     */
    send(msg: Type): void;
    /**
     * kill the process.
     */
    kill(): void;
}
/**
 * Process actor for spawning remote actors in a Node.js child process.
 *
 * The child process is treated as a single actor in the system and can
 * communicate with the main process's VM via the relevant functions exported by
 * this module.
 *
 * The child process will have access to the following environment variables:
 *
 * 1. POTOO_ACTOR_ID -      The id of the Process actor's template.
 *
 * 2. POTOO_ACTOR_ADDRESS   The full address of the Process in the parent VM.
 *                          This will be used as the value for self().
 */
export declare class Process implements Actor {
    system: System;
    script: Path;
    /**
     * @param system - The system the actor belongs to.
     * @param script - The script that will be executed in the child process.
     */
    constructor(system: System, script: Path);
    /**
     * handle is the child process spawned for this actor.
     */
    handle: Maybe<Handle>;
    /**
     * spawnChildProcess spawns the Node.js child process using the provided
     * options.
     *
     * The following event handlers are installed on the child process:
     *
     * 1. "error"   - will raise through the error handling machinery.
     * 2. "message  - will forward messages in the correct format from the child
     *                process to other actors in the system.
     * 3. "exit"    - will signal to the VM to kill this actor.
     */
    spawnChildProcess(self: Address, opts: object): ChildProcess;
    init(c: Context): Context;
    accept(e: Envelope): Process;
    notify(): void;
    stop(): void;
    start(addr: Address): void;
}
/**
 * VMProcess spawns a child VM in a new Node.js process.
 *
 * This is different to the [[Process]] actor because it allows the child
 * process to maintain its own tree of actors, routing messaging between
 * it and the main process's VM.
 *
 * The sub-VM is created and setup via a script file local to this module.
 *
 * The child process will have access to the following environment variables:
 *
 * 1. POTOO_ACTOR_ID -      The id of the VMProcess actor's template. This
 *                          should be used as the id for the actor first actor
 *                          spawned.
 *
 * 2. POTOO_ACTOR_ADDRESS   The full address of the VMProcess in the parent VM.
 * 3. POTOO_ACTOR_MODULE    The path to a node module whose default export is a
 *                          function receiving a vm instance that produces a
 *                          template or list of templates to spawn.
 * 4. POTOO_PVM_CONF        A JSON.stringify() version of the main VM's conf.
 */
export declare class VMProcess extends Process {
    system: System;
    module: Path;
    script: string;
    /**
     * @param system     - The parent system.
     * @param module     - A path to a module that exports a system() function
     *                     that provides the System instance and a property
     *                     "spawnable" that is a Spawnable that will be spawned.
     *                     that will be spawned serving as the first actor.
     * @param [script]   - This is the script used to setup the child VM, it can
     *                     be overridden for a custom implementation.
     */
    constructor(system: System, module: Path, script?: string);
    init(c: Context): Context;
    start(addr: Address): void;
}
/**
 * init should be called as early as possible in the child process if using the
 * direct API (Process).
 *
 * It sets up a listener for incoming messages to the child_process that can
 * be read later via receive() or select().
 */
export declare const init: () => void;
/**
 * self provides the address for this child actor.
 */
export declare const self: () => string;
/**
 * tell sends a message to another actor in the system using the VM in the
 * parent process.
 */
export declare const tell: <M>(to: Address, msg: M) => any;
/**
 * receive the next message in the message queue.
 */
export declare const receive: <M>() => Future<M>;
/**
 * select the next desired message in the message queue using a list of [[Case]]
 * classes.
 */
export declare const select: <M>(cases: Case<M>[]) => Future<void>;
/**
 * exist the actor.
 *
 * This is simply a wrapper around process.exit();
 */
export declare const exit: () => never;
