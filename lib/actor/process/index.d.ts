/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { System } from '../system';
import { Envelope } from '../system/mailbox';
import { Actor } from '../';
export declare const SCRIPT_PATH: string;
/**
 * Path to the actor process.
 */
export declare type Path = string;
/**
 * Process actor.
 *
 * This actor works by dynamically spawning a new system in another
 * process and routing messages between it and the parent process.
 *
 * The module argument must be the absolute path to a script file
 * that exports a function called "create" that corresponds to the
 * Template interface's create function.
 *
 * The actor created by that function will received a "serialized"
 * copy of all messages the parent process sends to this one.
 *
 * We use node's builtin child_process API to monitor and receive
 * messages from the child process.
 */
export declare class Process implements Actor {
    module: Path;
    system: System;
    constructor(module: Path, system: System);
    handle: Maybe<ChildProcess>;
    accept(e: Envelope): Process;
    stop(): void;
    run(): void;
}
