import { Message } from '../../../message';
import { Envelope } from '../../../mailbox';
import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Executor } from '../';
import { OP_CODE_TELL, Log, Op, Level } from './';

/**
 * Tell delivers the first message in the outbox queue to the address
 * at the top of the data stack.
 *
 * Pops:
 * 1. Address
 * 2. Message
 */
export class Tell<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_TELL;

    public level = Level.Actor;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();

        let eitherAddr = curr.resolveAddress(curr.pop());

        if (eitherAddr.isLeft())
            return e.raise(eitherAddr.takeLeft());

        let eitherMsg = curr.resolveMessage(curr.pop());

        if (eitherMsg.isLeft())
            return e.raise(eitherMsg.takeRight());

        let addr = eitherAddr.takeRight();

        let msg = eitherMsg.takeRight();

        let maybeRouter = e.getRouter(addr);

        if (maybeRouter.isJust()) {

            deliver(maybeRouter.get(), new Envelope(addr, curr.actor, msg));

        } else {

            let maybeCtx = e.getContext(addr);

            if (maybeCtx.isJust()) {

                deliver(maybeCtx.get(), msg);

            } else {

                //send to "?"

            }

        }


    }

    toLog(f: Frame<C, S>): Log {

        return ['tell', [], [f.peek(), f.peek(1)]];

    }

}

const deliver = <C extends Context>(ctx: C, msg: Message) =>
    ctx
        .mailbox
        .map(mbox => mbox.push(msg))
        .orJust(() => ctx.actor.accept(msg));
