import * as op from '../system/op';
import { resolve } from 'path';
import { ChildProcess, fork } from 'child_process';
import { Maybe, nothing, just } from '@quenk/noni/lib/data/maybe';
import { match } from '@quenk/noni/lib/control/match';
import { Any } from '@quenk/noni/lib/data/type';
import { System } from '../system';
import { Raise } from '../system/op/raise';
import { Kill } from '../system/op/kill';
import { Drop } from '../system/op/drop';
import { Tell } from '../system/op/tell';
import { Route } from '../system/op/route';
import { Context } from '../context';
import { Envelope } from '../mailbox';
import { Message } from '../message';
import { Address, getId } from '../address';
import { Actor } from '../';

export const SCRIPT_PATH = `${__dirname}/../../../lib/actor/process/script.js`;

const raiseShape = {

    code: op.OP_RAISE,

    src: String,

    dest: String,

    error: { message: String }

}

const tellShape = {

    code: op.OP_TELL,

    to: String,

    from: String,

    message: Any

}

/**
 * Path to the actor process.
 */
export type Path = string;

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

    constructor(public module: Path, public system: System<C>) { }

    handle: Maybe<ChildProcess> = nothing();

    self = () => this.system.identify(this);

    init(c: C): C {

        c.flags.immutable = true;
        c.flags.buffered = false;
        return c;

    }

    accept(e: Envelope): Process<C> {

        this
            .handle
            .map(p => p.send(new Tell(e.to, e.from, e.message)))
            .orJust(() => new Drop(e.to, e.from, e.message))

        return this;

    }

    stop() {

        this.handle =
            this
                .handle
                .map(p => p.kill())
                .chain(() => nothing());

    }

    run() {

        this.handle =
            just(spawn(this))
                .map(handleErrors(this))
                .map(handleMessages(this))
                .map(handleExit(this));

        this.system.exec(new Route(this.self(), this.self()));

    }

}

const spawn = <C extends Context>(p: Process<C>) => fork(resolve(SCRIPT_PATH), [], {

    env: {

        POTOO_ACTOR_ID: getId(p.self()),

        POTOO_ACTOR_ADDRESS: p.self(),

        POTOO_ACTOR_MODULE: p.module

    }

})

const handleMessages = <C extends Context>(p: Process<C>) => (c: ChildProcess) =>
    c.on('message', (m: Message) => match(m)
        .caseOf(tellShape, handleTellMessage(p))
        .caseOf(raiseShape, handleRaiseMessage(p))
        .orElse((m: Message) => p.system.exec(new Drop(p.self(), p.self(), m)))
        .end());

const handleTellMessage = <C extends Context>(p: Process<C>) => ({ to, from, message }
    : { to: Address, from: Address, message: Message }) =>
    p.system.exec(new Tell(to, from, message));

const handleRaiseMessage =
    <C extends Context>(p: Process<C>) => ({ error: { message }, src, dest }
        : { error: { message: string }, src: string, dest: string }) =>
        p.system.exec(new Raise(new Error(message), src, dest));

const handleErrors = <C extends Context>(p: Process<C>) => (c: ChildProcess) =>
    c.on('error', raise(p))

const raise = <C extends Context>(p: Process<C>) => (e: Error) =>
    p.system.exec(new Raise(e, p.self(), p.self()));

const handleExit = <C extends Context>(p: Process<C>) => (c: ChildProcess) =>
    c.on('exit', () => p.system.exec(new Kill(p.self(), p)));
