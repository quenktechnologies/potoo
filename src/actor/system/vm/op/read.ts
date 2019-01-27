import { fromArray } from '@quenk/noni/lib/data/maybe';
import { Context } from '../../../context';
import { Message } from '../../../message';
import { Behaviour } from '../../../';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_READ = 0x10;

/**
 * Read consumes the next message in the current actor's mailbox.
 *
 * Pops:
 *
 * 1. Address of the target actor.
 *
 * Pushes
 *
 * 1. The number 1 if successful or 0 if the message was not processed.
 */
export class Read<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_READ;

    public level = Level.Actor;

    exec(e: Executor<C, S>): void {

        fromArray<Behaviour>(e.current.context.behaviour)
            .chain((b: Behaviour[]) =>
                e
                    .current
                    .context
                    .mailbox
                    .chain(fromArray)
                    .map(mbox =>
                        (b[0](mbox.shift()))
                            .lmap(m => {
console.error('steupes ', m, b);
                                mbox.unshift(<Message>m);
                                e.current.pushNumber(0);

                            })
                            .map(() => {

                                if (!e.current.context.flags.immutable)
                                    e.current.context.behaviour.shift();

                                e.current.pushNumber(1);

                            })));


    }

    toLog(): string {

        return 'read';

    }

}
