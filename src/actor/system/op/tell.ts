import * as log from '../log';
import * as hooks from '../hooks';
import { tick } from '@quenk/noni/lib/control/timer';
import { noop } from '@quenk/noni/lib/data/function';
import { fromNullable } from '@quenk/noni/lib/data/maybe';
import { Address } from '../../address';
import { Message } from '../../message';
import { Mailbox, Envelope } from '../../mailbox';
import { Context } from '../../context';
import { getRouter, get } from '../state';
import { System } from '../';
import { Check } from './check';
import { Transfer } from './transfer';
import { Discard } from './discard';
import { OP_TELL, Op, Executor } from './';

/**
 * Tell instruction.
 *
 * If there is a router registered for the "to" address, the message
 * is transfered to that address. Otherwise, provided the actor exists, 
 * we put the message in it's mailbox and schedule a Check.
 *
 * The message is dropped otherwise.
 */
export class Tell<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(
        public to: Address,
        public from: Address,
        public message: Message) { super(); }

    public code = OP_TELL;

    public level = log.INFO;

    exec(s: Executor<C, S>): void {

        return execTell(s, this);

    }

}

 const execTell = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, op: Tell<C, S>) =>
    getRouter(s.state, op.to)
        .map(runTransfer(s, op))
        .orElse(runTell(s, op))
        .orElse(invokeDropHook(s, op))
        .orJust(justDrop(s, op))
        .map(noop)
        .get();

const runTransfer = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, { to, from, message }: Tell<C, S>) => (r: Address) =>
        s.exec(new Transfer(to, from, r, message));

const runTell = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, op: Tell<C, S>) => () =>
        get(s.state, op.to).chain(doTell(s, op));

const doTell = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, op: Tell<C, S>) => (f: C) =>
        f
            .mailbox
            .map(doTellMailbox(s, op))
            .orJust(() => f.actor.accept(toEnvelope(op)));

const doTellMailbox = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, { to, from, message }: Tell<C, S>) => (m: Mailbox) =>
        tick(() => {

            m.push(new Envelope(to, from, message));
            s.exec(new Check(to));

        });

const invokeDropHook = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, op: Tell<C, S>) => () =>
        fromNullable(s.configuration.hooks)
            .chain((h: hooks.Hooks) => fromNullable(h.drop))
            .map((f: hooks.Drop) => f(toEnvelope(op)));

const justDrop = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, { to, from, message }: Tell<C, S>) => () =>
        s.exec(new Discard(to, from, message));

const toEnvelope = <C extends Context, S extends System<C>>
    ({ to, from, message }: Tell<C, S>) =>
    new Envelope(to, from, message);
