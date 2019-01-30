import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Log, Op, Level } from './';

export const OP_CODE_DISCARD = 0xb;

/**
 * Discard removes and discards the first message in a Context's mailbox.
 */
export class Discard<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_DISCARD

    public level = Level.Actor;

    exec(e: Executor<C, S>): void {

        e.current().get().context.mailbox.map(box => box.shift());

    }

    toLog(): Log {

        return ['discard',[],[]];

    }

}
