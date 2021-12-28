import { Type } from '@quenk/noni/lib/data/type';
import { Context } from '../system/vm/runtime/context';
import { System } from '../system';
import { Envelope } from '../mailbox';
import { Address } from '../address';
import { Actor } from '../';
export declare const SCRIPT_PATH: string;
/**
 * Path to the actor process.
 */
export declare type Path = string;
/**
 * Handle to a node process.
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
 * Process actor.
 *
 * This actor works by spawning a VM in another process to route messages
 * between it and it's parent.
 *
 * The module argument must be an absolute path to a script file
 * that exports a function "create". This has to correspond with the
 * Template interface's create function.
 *
 * The actor created by that function will received a "stringified"
 * copy of all messages bound for it from the parent process.
 *
 * Node's builtin child_process API to monitor and receive
 * messages from the child process.
 */
export declare class Process implements Actor {
    module: Path;
    system: System;
    script: string;
    constructor(module: Path, system: System, script?: string);
    process: Handle;
    self: () => string;
    init(c: Context): Context;
    accept(e: Envelope): Process;
    notify(): void;
    stop(): void;
    start(addr: Address): void;
}
