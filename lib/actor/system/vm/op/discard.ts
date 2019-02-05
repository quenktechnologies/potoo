import * as errors from '../error';
import { fromArray } from '@quenk/noni/lib/data/maybe';
import { Context } from '../../../context';
import { System } from '../../';
import { Runtime } from '../runtime';
import { OP_CODE_DISCARD, Log, Op, Level } from './';

/**
 * Discard removes and discards the first message in a Context's mailbox.
 */
export class Discard<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_DISCARD

    public level = Level.Actor;

    exec(e: Runtime<C, S>): void {

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

        return ['discard', [], []];

    }

}
