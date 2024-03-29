import { resolve } from 'path';
import { ChildProcess, fork } from 'child_process';

import { match } from '@quenk/noni/lib/control/match';
import { just, Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Future, run, wrap } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';
import { empty, tail } from '@quenk/noni/lib/data/array';
import { noop } from '@quenk/noni/lib/data/function';

import { Context } from '../../system/vm/runtime/context';
import { EVENT_MESSAGE_DROPPED, EVENT_SEND_FAILED } from '../../system/vm/event';
import { LogWriter, LOG_LEVEL_ERROR } from '../../system/vm/log';
import { CaseFunction } from '../../resident/case/function';
import { Case } from '../../resident/case';
import { PVM } from '../../system/vm';
import { System } from '../../system';
import { Envelope } from '../../mailbox';
import { Message } from '../../message';
import { Address, ADDRESS_DISCARD, getId } from '../../address';
import { FLAG_IMMUTABLE, FLAG_ROUTER } from '../../flags';
import { Actor } from '../../';
import { Drop, Raise, RemoteError, Send, shapes } from '..';

export const SCRIPT_PATH = `${__dirname}/../../../actor/remote/process/script.js`;

/**
 * Path to the actor process.
 */
export type Path = string;

/**
 * Handle to a node process.
 *
 * This is declared here to limit it to the used methods.
 */
export interface Handle {

    /**
     * send a message to the process.
     */
    send(msg: Type): void

    /**
     * kill the process.
     */
    kill(): void

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
export class Process implements Actor {

    /**
     * @param system - The system the actor belongs to.
     * @param script - The script that will be executed in the child process.
     */
    constructor(public system: System, public script: Path) { }

    /**
     * handle is the child process spawned for this actor.
     */
    handle: Maybe<Handle> = nothing();

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
    spawnChildProcess(self: Address, opts: object): ChildProcess {

        let handle = fork(resolve(this.script), [], opts);

        handle.on('error', (e: Error) =>
            this.system.getPlatform().raise(this, e));

        handle.on('message', (m: Message) =>
            match(m)
                .caseOf(shapes.raise, ({ message, stack }: Raise) => {

                    let err = new Error(message);

                    err.stack = stack;

                    this.system.getPlatform().raise(this, err);

                })

                .caseOf(shapes.send, (m: Envelope) => {

                    let vm = (<PVM>this.system.getPlatform());

                    vm.sendMessage(m.to, m.from, m.message)

                })

                .caseOf(shapes.drop, (m: Drop) =>
                    this
                        .system
                        .getPlatform()
                        .events
                        .publish(m.from, EVENT_SEND_FAILED, m.to, m.message))
                .orElse((m: any) => { console.error("SPC", m); })
                .end());

        handle.on('exit', () => {

            this.handle = nothing();

            this.system.getPlatform().kill(this, self);

        });

        return handle;

    }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_ROUTER;

        return c;

    }

    accept(e: Envelope): Process {

        if (this.handle.isJust())
            this.handle.get().send(e);

        return this;

    }

    notify() { }

    stop() {

        if (this.handle.isJust()) this.handle.get().kill();

    }

    start(addr: Address) {

        this.handle = just(this.spawnChildProcess(addr, {

            env: {

                POTOO_ACTOR_ID: getId(addr),

                POTOO_ACTOR_ADDRESS: addr

            }

        }));

    }

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
export class VMProcess extends Process {

    /**
     * @param system     - The parent system.
     * @param module     - A path to a module that exports a system() function
     *                     that provides the System instance and a property
     *                     "spawnable" that is a Spawnable that will be spawned.
     *                     that will be spawned serving as the first actor.
     * @param [script]   - This is the script used to setup the child VM, it can
     *                     be overridden for a custom implementation.
     */
    constructor(
        public system: System,
        public module: Path,
        public script = SCRIPT_PATH) { super(system, script); }

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_ROUTER;

        return c;

    }

    start(addr: Address) {

        this.handle = just(this.spawnChildProcess(addr, {

            env: {

                POTOO_ACTOR_ID: getId(addr),

                POTOO_ACTOR_ADDRESS: addr,

                POTOO_ACTOR_MODULE: this.module,

                POTOO_PVM_CONF: process.env.POTOO_PVM_CONF,

                POTOO_LOG_LEVEL: String(this.system.getPlatform().log.level)

            }

        }));

    }

}

const messages: Message[] = [];

/**
 * init should be called as early as possible in the child process if using the
 * direct API (Process).
 *
 * It sets up a listener for incoming messages to the child_process that can
 * be read later via receive() or select().
 */
export const init = () => {

    if (!process.send)
        throw new Error('process: direct API is meant to ' +
            'be used in a child process!');

    process.on('message', (m: Message) => {
        if (m && m.to && m.message) {
            messages.unshift(m.message);
            doReceive();
        }
    });

    process.on('uncaughtExceptionMonitor', err =>
        (<Function>process.send)(new RemoteError(err)));

}

/**
 * self provides the address for this child actor.
 */
export const self = () => process.env.POTOO_ACTOR_ADDRESS || ADDRESS_DISCARD;

/**
 * tell sends a message to another actor in the system using the VM in the 
 * parent process.
 */
export const tell = <M>(to: Address, msg: M) =>
    (<Function>process.send)(new Send(to, self(), msg));

const receivers: Function[] = [];

const doReceive = () => {

    if (!empty(receivers))
        (<Function>receivers.pop())();

}

/**
 * receive the next message in the message queue.
 */
export const receive = <M>(): Future<M> => run(()=>new Promise(resolve => {

    receivers.push(() => resolve(messages.pop()));

    if (!empty(messages)) doReceive();

    return noop;

}));

const writer = new LogWriter(
    console,
    Number(process.env.POTOO_LOG_LEVEL) || LOG_LEVEL_ERROR
);

/**
 * select the next desired message in the message queue using a list of [[Case]]
 * classes.
 */
export const select = <M>(cases: Case<M>[]): Future<void> =>
    run(()=> new Promise((onSuccess, onError) => {

        let f = new CaseFunction(cases);

        receivers.push(() => {

            if (f.test(tail(messages)))
                wrap(f.apply(messages.pop())).fork(onError, onSuccess);
            else
                writer.event(self(), EVENT_MESSAGE_DROPPED, messages.pop());

        });

        if (!empty(messages)) doReceive();

        return noop;

    }));

/**
 * exist the actor.
 *
 * This is simply a wrapper around process.exit();
 */
export const exit = () => process.exit();
