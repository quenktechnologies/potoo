import * as errors from '../error';
import { fromArray } from '@quenk/noni/lib/data/maybe';
import { Runtime } from '../runtime';
import { Type, Location } from '../frame';
import { OP_CODE_DISCARD, Log, Op, Level } from './';

/**
 * Discard removes and discards the first message in a Context's mailbox.
 */
export class Discard implements Op {

    public code = OP_CODE_DISCARD

    public level = Level.Actor;

    exec(e: Runtime): void {

        let curr = e.current().get();

        let maybBox = curr.context.mailbox;

        if (maybBox.isNothing())
            return e.raise(new errors.NoMailboxErr(e.self));

        let mayBMail = maybBox.chain(fromArray);

        if (mayBMail.isNothing())
            return e.raise(new errors.EmptyMailboxErr(e.self));

        mayBMail.get().shift();

    }

    toLog(): Log {

        return ['discard', [], [[0, Type.Message, Location.Mailbox]]];

    }

}
