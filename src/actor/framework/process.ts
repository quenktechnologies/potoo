import { resolve } from 'path';
import { ChildProcess, fork } from 'child_process';

import { Path } from '@quenk/noni/lib/data/record/path';
import { match } from '@quenk/noni/lib/control/match';
import { just, Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';
import { empty } from '@quenk/noni/lib/data/array';

import { Address, ADDRESS_DISCARD, getId } from '../address';
import { Actor, Message } from '../';
import { Runtime } from '../system/vm/runtime';
import { Raise, RemoteError, Send, shapes } from './remote';

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
export class Process implements Actor {
    /**
     * @param runtime - The runtime for the actor.
     * @param script - The script that will be executed in the child process.
     */
    constructor(
        public runtime: Runtime,
        public script: Path
    ) {}

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
    spawnChildProcess(opts: object): ChildProcess {
        let handle = fork(resolve(this.script), [], opts);

        handle.on('error', (err: Error) => this.runtime.raise(err));

        handle.on('message', (m: Message) =>
            match(m)
                .caseOf(shapes.raise, ({ message, stack }: Raise) => {
                    let err = new Error(message);

                    err.stack = stack;

                    this.runtime.raise(err);
                })

                .caseOf(shapes.send, (m: { to: Address; message: Message }) => {
                    this.runtime.watch(() =>
                        this.runtime.tell(m.to, m.message)
                    );
                })

                .caseOf(shapes.drop, () => {
                    //TODO: Publish drop event.
                })
                .end()
        );

        handle.on('exit', () => {
            this.handle = nothing();
            this.runtime.kill(this.runtime.self);
        });

        return handle;
    }

    async notify(msg: Message) {
        if (this.handle.isJust()) this.handle.get().send(msg);
    }

    async stop() {
        if (this.handle.isJust()) this.handle.get().kill();
    }

    async start() {
        let addr = this.runtime.self;
        this.handle = just(
            this.spawnChildProcess({
                env: {
                    POTOO_ACTOR_ID: getId(addr),

                    POTOO_ACTOR_ADDRESS: addr
                }
            })
        );
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
        throw new Error(
            'process: direct API is meant to ' + 'be used in a child process!'
        );

    process.on('message', (m: Message) => {
        if (m && m.to && m.message) {
            messages.unshift(m.message);
            drain();
        }
    });

    process.on('uncaughtExceptionMonitor', err =>
        (<Function>process.send)(new RemoteError(err))
    );
};

/**
 * self provides the address for this child actor.
 */
export const self = process.env.POTOO_ACTOR_ADDRESS || ADDRESS_DISCARD;

/**
 * tell sends a message to another actor in the system using the VM in the
 * parent process.
 */
export const tell = <M>(to: Address, msg: M) =>
    (<Function>process.send)(new Send(self, to, msg));

type Handler = (value: Type) => void;

const receivers: Handler[] = [];

/**
 * receive the next message in the message queue.
 */
export const receive = () =>
    Future.do(
        () =>
            new Promise(resolve => {
                receivers.push(resolve);
                drain();
            })
    );

const drain = () => {
    if (!empty(messages) && !empty(receivers))
        (<Handler>receivers.pop())(messages.shift());
};

/**
 * exist the actor.
 *
 * This is simply a wrapper around process.exit();
 */
export const exit = () => process.exit();
