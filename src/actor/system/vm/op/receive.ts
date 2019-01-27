import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_RECEIVE = 0x12;

/**
 * Receive schedules a handler for a resident actor to receive the next
 * message from its mailbox.
 *
 * Pops:
 *  1. Reference to a foreign function that will be installed as the message 
 *     handler.
 */
export class Receive<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_RECEIVE;

    public level = Level.Actor;

    exec(e: Executor<C, S>): void {

        e
            .current
            .resolveForeign(e.current.pop())
            .map(f => e.current.context.behaviour.push(f))
            .map(() => {

                e
                    .current
                    .context
                    .mailbox
                    .map(box => {

                        if (box.length > 0)
                            e.current.context.actor.notify();

                    })

            })
            .lmap(err => e.raise(err))

    }

    toLog(): string {

        return 'receive';

    }

}
