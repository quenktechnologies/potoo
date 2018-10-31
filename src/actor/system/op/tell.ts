import * as log from '../log';
import * as hooks from '../hooks';
import { tick } from '@quenk/noni/lib/control/timer';
import { noop } from '@quenk/noni/lib/data/function';
import { fromNullable } from '@quenk/noni/lib/data/maybe';
import { Address } from '../../address';
import { Message } from '../../message';
import { Mailbox, Envelope } from '../mailbox';
import { Context } from '../state/context';
import { getRouter, get } from '../state';
import { Check } from './check';
import { Transfer } from './transfer';
import { Drop } from './drop';
import { OP_TELL, Op, Executor } from './';

/**
 * Tell instruction.
 */
export class Tell extends Op {

    constructor(
        public to: Address,
        public from: Address,
        public message: Message) { super(); }

    public code = OP_TELL;

    public level = log.INFO;

    exec<C extends Context>(s: Executor<C>): void {

        return execTell(s, this);

    }

}

/**
 * execTell
 *
 * If there is a router registered for the "to" address, the message
 * is transfered.
 *
 * Otherwise provided, the actor exists, we put the message in it's
 * mailbox and issue a Check.
 *
 * The message is dropped otherwise.
 */
export const execTell = <C extends Context>(s: Executor<C>, op: Tell) =>
    getRouter(s.state, op.to)
        .map(runTransfer(s, op))
        .orElse(runTell(s, op))
        .orElse(invokeDropHook(s, op))
        .orJust(justDrop(s, op))
        .map(noop)
        .get();

const runTransfer = <C extends Context>
    (s: Executor<C>, { to, from, message }: Tell) => (r: Address) =>
        s.exec(new Transfer(to, from, r, message));

const runTell = <C extends Context>(s: Executor<C>, op: Tell) => () =>
    get(s.state, op.to).chain(doTell(s, op));

const doTell = <C extends Context>(s: Executor<C>, op: Tell) => (f: C) =>
    f
        .mailbox
        .map(doTellMailbox(s, op))
        .orJust(() => f.actor.accept(toEnvelope(op)));

const doTellMailbox = <C extends Context>
    (s: Executor<C>, { to, from, message }: Tell) => (m: Mailbox) =>
        tick(() => {

            m.push(new Envelope(to, from, message));
            s.exec(new Check(to));

        });

const invokeDropHook = <C extends Context>(s: Executor<C>, op: Tell) => () =>
    fromNullable(s.configuration.hooks)
        .chain((h: hooks.Hooks) => fromNullable(h.drop))
        .map((f: hooks.Drop) => f(toEnvelope(op)));

const justDrop =
    <C extends Context>(s: Executor<C>, { to, from, message }: Tell) => () =>
        s.exec(new Drop(to, from, message));

const toEnvelope = ({ to, from, message }: Tell) =>
    new Envelope(to, from, message);
