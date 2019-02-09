import { ChildProcess } from 'child_process';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { System } from '../system';
import { Context } from '../context';
import { Envelope } from '../mailbox';
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
export declare class Process<C extends Context> implements Actor<C> {
    module: Path;
    system: System<C>;
    script: string;
    constructor(module: Path, system: System<C>, script?: string);
    process: Maybe<ChildProcess>;
    self: () => string;
    init(c: C): C;
    accept(e: Envelope): Process<C>;
    notify(): void;
    stop(): void;
    run(): void;
}
