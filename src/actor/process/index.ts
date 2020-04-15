import { resolve } from 'path';
import { fork } from 'child_process';

import { match } from '@quenk/noni/lib/control/match';
import { Any, Type } from '@quenk/noni/lib/data/type';

import { System } from '../system';
import { RAISE, SEND } from '../system/vm/runtime/op';
import { Context } from '../system/vm/runtime/context';
import { Envelope } from '../mailbox';
import { Message } from '../message';
import { Address, getId } from '../address';
import { FLAG_IMMUTABLE, FLAG_BUFFERED, FLAG_ROUTER } from '../flags';
import { ADDRESS_DISCARD } from '../address';
import { Tell, Raise, Kill } from '../resident/scripts';
import { Actor } from '../';

export const SCRIPT_PATH = `${__dirname}/../../../lib/actor/process/script.js`;

const raiseShape = {

    code: RAISE,

    src: String,

    dest: String,

    error: { message: String }

}

const tellShape = {

    code: SEND,

    to: String,

    from: String,

    message: Any

}

/**
 * Path to the actor process.
 */
export type Path = string;

interface TellMsg {

    to: Address,

    message: Message
}

interface RaiseMsg {

    error: { message: string },

    src: string

}

/**
 * Handle to a node process.
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
export class Process implements Actor {

    constructor(
        public module: Path,
        public system: System,
        public script = SCRIPT_PATH) { }

    process: Handle = nullHandle;

    self = () => ADDRESS_DISCARD;

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | (~FLAG_BUFFERED) | FLAG_ROUTER;
        return c;

    }

    accept(e: Envelope): Process {

        this.process.send(e);
        return this;

    }

    notify() {

    }

    stop() {

        this.process.kill();

    }

    start(addr: Address) {

        this.self = () => addr;

        let p = fork(resolve(this.script), [], spawnOpts(this));

        p.on('error', e => this.system.exec(this, new Raise(e.message)));

        //TODO: What should we do with invalid messages?
        p.on('message', (m: Message) =>
            match(m)
                .caseOf(tellShape, handleTell(this))
                .caseOf(raiseShape, handleRaise(this))
                .orElse(() => { })
                .end());

        p.on('exit', () => {

            this.process = nullHandle;

            this.system.exec(this, new Kill(this.self()));

        });

        this.process = p;

    }

}

const nullHandle = {

    send() {

    },

    kill() {


    }

}

const spawnOpts = (p: Process) => ({

    env: {

        POTOO_ACTOR_ID: getId(p.self()),

        POTOO_ACTOR_ADDRESS: p.self(),

        POTOO_ACTOR_MODULE: p.module,

        POTOO_PVM_CONF: process.env.POTOO_PVM_CONF

    }

});

const handleTell = (p: Process) => (m: TellMsg) =>
    p.system.exec(p, new Tell(m.to, m.message));

const handleRaise =
    (p: Process) => ({ error: { message }, src }: RaiseMsg) =>
        p.system.exec(p, new Raise(`Error message from ${src}: ${message}`));
