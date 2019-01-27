import { Address } from '../../../address';
import { Message } from '../../../message';
import { Envelope } from '../../../mailbox';
import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_TELL = 0x7;

/**
 * Tell delivers the first message in the outbox queue to the address
 * at the top of the data stack.
 *
 * Pops:
 * 1. Address
 * 2. Message
 *
 * TODO: explicitly support routers, give dropped messages to ?
 */
export class Tell<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_TELL;

    public level = Level.Actor;

    exec(e: Executor<C, S>): void {

        e
            .current
            .resolveAddress(e.current.pop())
            .chain(addr =>
                e
                    .current
                    .resolveMessage(e.current.pop())
                    .map(m => {

                        let maybeCtx = e.getContext(addr);

                        if (maybeCtx.isNothing())
                            return // do nothing, maybe drop in future?

                        let ctx = maybeCtx.get();

                        ctx
                            .mailbox
                            .map(mbox => mbox.push(m))
                            .orJust(() => ctx.actor.accept(envelope(addr, '', m)));

                    })
                    .orRight(err => e.raise(err)));

    }

    toLog(): string {

        return `tell`;

    }

}

const envelope = (to: Address, from: Address, msg: Message) =>
    new Envelope(to, from, msg);

