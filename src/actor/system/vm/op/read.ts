import * as errors from '../error';
import { fromArray } from '@quenk/noni/lib/data/maybe';
import { Context } from '../../../context';
import { Message } from '../../../message';
import { Behaviour } from '../../../';
import { Runtime } from '../runtime';
import {Type,Location} from '../frame';
import { System } from '../../';
import { OP_CODE_READ, Log, Op, Level } from './';

/**
 * Read consumes the next message in the current actor's mailbox.
 *
 * Pushes
 *
 * The number 1 if successful or 0 if the message was not processed.
 */
export class Read<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_READ;

    public level = Level.Actor;

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();

        let maybBehave = fromArray<Behaviour>(curr.context.behaviour);

        if (maybBehave.isNothing())
            return e.raise(new errors.NoReceiveErr(e.self));

        let stack = maybBehave.get();

        let maybMbox = curr.context.mailbox;

        if (maybMbox.isNothing())
            return e.raise(new errors.NoMailboxErr(e.self));

        let maybHasMail = maybMbox.chain(fromArray);

        if (maybHasMail.isNothing()) {

            return e.raise(new errors.EmptyMailboxErr(e.self));

        } else {

            let mbox = maybHasMail.get();

            let eitherRead = stack[0](mbox.shift());

            if (eitherRead.isLeft()) {

                mbox.unshift(<Message>eitherRead.takeLeft());
                curr.pushNumber(0);

            } else {

                if (!curr.context.flags.immutable)
                    curr.context.behaviour.shift();

                curr.pushNumber(1);

            }

        }

    }

    toLog(): Log {

        return ['read', [], [[0, Type.Message, Location.Mailbox]]];

    }

}
