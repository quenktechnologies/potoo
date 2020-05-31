import { Runtime } from '../runtime';
import { Frame } from '../frame';
import { OP_CODE_RECEIVE, Log, Op, Level } from './';

/**
 * Receive schedules a handler for a resident actor to receive the next
 * message from its mailbox.
 *
 * Pops:
 *  1. Reference to a foreign function that will be installed as the message 
 *     handler.
 */
export class Receive implements Op {

    public code = OP_CODE_RECEIVE;

    public level = Level.Actor;

    exec(e: Runtime): void {

        let curr = e.current().get();

        curr
            .resolveForeign(curr.pop())
            .map(f => curr.context.behaviour.push(f))
            .map(() => {

                curr
                    .context
                    .mailbox
                    .map(box => {

                        if (box.length > 0)
                            curr.context.actor.notify();

                    })

            })
            .lmap(err => e.raise(err))

    }

    toLog(f: Frame): Log {

        return ['receive', [], [f.peek()]];

    }

}