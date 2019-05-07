import { tick } from '@quenk/noni/lib/control/timer';
import { Message } from '../../../message';
import { Envelope } from '../../../mailbox';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Context } from '../../../context';
import { OP_CODE_TELL, Log, Op, Level } from './';

/**
 * Tell delivers the first message in the outbox queue to the address
 * at the top of the data stack.
 *
 * Pops:
 * 1. Address
 * 2. Message
 *
 * Pushes:
 *
 * 1 if delivery is successful, 0 otherwise.
 */
export class Tell implements Op {

    public code = OP_CODE_TELL;

    public level = Level.Actor;

    exec(e: Runtime): void {

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
            curr.pushNumber(1);

        } else {

            let maybeCtx = e.getContext(addr);
            let conf = e.config();

            if (maybeCtx.isJust()) {

                deliver(maybeCtx.get(), msg);
                curr.pushNumber(1);

            } else if (conf.hooks &&
                conf.hooks.drop) {

                conf.hooks.drop(new Envelope(addr, e.self, msg));

                curr.pushNumber(1);

            } else {

                curr.pushNumber(0);

            }

        }

    }

    toLog(f: Frame): Log {

        return ['tell', [], [f.peek(), f.peek(1)]];

    }

}

const deliver = (ctx: Context, msg: Message) => {

    if (ctx.mailbox.isJust()) {

        tick(() => { ctx.mailbox.get().push(msg); ctx.actor.notify(); });

    } else {

        ctx.actor.accept(msg);

    }

}

