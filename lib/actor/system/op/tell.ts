import * as log from '../log';
import * as hooks from '../hooks';
import { tick } from '@quenk/noni/lib/control/timer';
import { noop } from '@quenk/noni/lib/data/function';
import { fromNullable } from '@quenk/noni/lib/data/maybe';
import { Address } from '../../address';
import { Message } from '../../message';
import { Envelope } from '../mailbox';
import { System } from '../';
import { Check } from './check';
import { Transfer } from './transfer';
import { Drop } from './drop';
import { OP_TELL, Op } from './';

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

    exec(s: System): void {

        return execTell(s, this);

    }

}

/**
 * execTell
 *
 * Puts a message in the destination actor's mailbox and schedules
 * the Check instruction if the destination still exists.
 *
 * The message is dropped otherwise.
 */
export const execTell = (s: System, { to, from, message }: Tell) =>
    s
        .actors
        .getRouter(to)
        .map(r => s.exec(new Transfer(to, from, r, message)))
        .orElse(() =>
            s
                .actors
                .get(to)
                .map(f =>
                    tick(() => {
                        f.mailbox.push(new Envelope(to, from, message));
                        s.exec(new Check(to));
                    }))
                .orElse(() =>
                    fromNullable(s.configuration.hooks)
                        .chain((hs:hooks.Hooks) => fromNullable(hs.drop))
                        .map((f: hooks.Drop) => f(new Envelope(to, from, message))))
                .orJust(() => s.exec(new Drop(to, from, message))))
        .map(noop)
        .get();
