import { resolve } from 'path';
import { ChildProcess, fork } from 'child_process';
import { Maybe, nothing, just } from '@quenk/noni/lib/data/maybe';
import { match } from '@quenk/noni/lib/control/match';
import { Any } from '@quenk/noni/lib/data/type';
import { System } from '../system';
import { AcceptScript as DropScript, TellScript } from '../resident/scripts';
import { StopScript } from '../system/vm/runtime/scripts';
import { OP_CODE_RAISE, OP_CODE_TELL } from '../system/vm/op';
import { Context } from '../context';
import { Envelope } from '../mailbox';
import { Message } from '../message';
import { Address, getId } from '../address';
import { Actor } from '../';
import { RaiseScript } from './scripts';

export const SCRIPT_PATH = `${__dirname}/../../../lib/actor/process/script.js`;

const raiseShape = {

    code: OP_CODE_RAISE,

    src: String,

    dest: String,

    error: { message: String }

}

const tellShape = {

    code: OP_CODE_TELL,

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
export class Process<C extends Context> implements Actor<C> {

    constructor(
        public module: Path,
        public system: System<C>,
        public script = SCRIPT_PATH) { }

    process: Maybe<ChildProcess> = nothing();

    self = () => this.system.ident(this);

    init(c: C): C {

        c.flags.immutable = true;
        c.flags.buffered = false;
        c.flags.router = true;
        return c;

    }

    accept(e: Envelope): Process<C> {

        if (this.process.isJust()) {

            let p = this.process.get();

            p.send(e);

        } else {

            this.system.exec(this, new DropScript(e));

        }

        return this;

    }

    notify() { }

    stop() {

        if (this.process.isJust()) {

            this.process.get().kill();

            this.process = nothing();

        }

    }

    run() {

        this.process =
            just(fork(resolve(this.script), [], spawnOpts(this)))
                .map(handleErrors(this))
                .map(handleMessages(this))
                .map(handleExit(this));

    }

}

const spawnOpts = <C extends Context>(p: Process<C>) => ({

    env: {

        POTOO_ACTOR_ID: getId(p.self()),

        POTOO_ACTOR_ADDRESS: p.self(),

        POTOO_ACTOR_MODULE: p.module

    }

});

const handleMessages = <C extends Context>(p: Process<C>) => (c: ChildProcess) =>
    c.on('message', filterMessage(p));

const filterMessage = <C extends Context>(p: Process<C>) => (m: Message) =>
    match(m)
        .caseOf(tellShape, handleTell(p))
        .caseOf(raiseShape, handleRaise(p))
        .orElse(handleUnknown(p))
        .end();

const handleUnknown = <C extends Context>(p: Process<C>) => (m: Message) =>
    p.system.exec(p, new DropScript(m));

const handleTell = <C extends Context>(p: Process<C>) => (m: TellMsg) =>
    p.system.exec(p, new TellScript(m.to, m.message));

const handleRaise = <C extends Context>
    (p: Process<C>) => ({ error: { message }, src }: RaiseMsg) =>
        p.system.exec(p, new RaiseScript(`Error message from ${src}: ${message}`));

const handleErrors = <C extends Context>(p: Process<C>) => (c: ChildProcess) =>
    c.on('error', raise(p))

const raise = <C extends Context>(p: Process<C>) => (e: Error) =>
    p.system.exec(p, new RaiseScript(e.message));

const handleExit = <C extends Context>(p: Process<C>) => (c: ChildProcess) =>
    c.on('exit', () => p.system.exec(p, new StopScript(p.self())));
