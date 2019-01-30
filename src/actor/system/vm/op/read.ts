import { fromArray } from '@quenk/noni/lib/data/maybe';
import { Context } from '../../../context';
import { Message } from '../../../message';
import { Behaviour } from '../../../';
import { System } from '../../';
import { Executor } from '../';
import { Log, Op, Level } from './';

export const OP_CODE_READ = 0x10;

/**
 * Read consumes the next message in the current actor's mailbox.
 *
 * Pushes
 *
 * 1. The number 1 if successful or 0 if the message was not processed.
 */
export class Read<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_READ;

    public level = Level.Actor;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();

        fromArray<Behaviour>(curr.context.behaviour)
            .chain((b: Behaviour[]) =>
                curr
                    .context
                    .mailbox
                    .chain(fromArray)
                    .map(mbox =>
                        (b[0](mbox.shift()))
                            .lmap(m => {

                                mbox.unshift(<Message>m);
                                curr.pushNumber(0);

                            })
                            .map(() => {

                                if (!curr.context.flags.immutable)
                                    curr.context.behaviour.shift();

                                curr.pushNumber(1);

                            })));


    }

    toLog(): Log {

        return ['read', [],[]];

    }

}
