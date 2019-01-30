import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Executor } from '../';
import { Log, Op, Level } from './';

export const OP_CODE_RESTART = 0x23;

/**
 * Restart the current or a child actor.
 *
 * Pops:
 * 1. Address of the actor to restart.
 */
export class Restart<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_RESTART;

    public level = Level.Control;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();

        curr
            .resolveAddress(curr.pop())
            .map(addr => {

                e
                    .getContext(addr)
                    .map(ctx => {

                        ctx.actor.stop();

                        let nctx = e.allocate(addr, ctx.template);

                        nctx.mailbox = ctx.mailbox;

                        e.putContext(addr, nctx);

                    });

            })

    }

    toLog(f: Frame<C, S>): Log {

      return ['restart', [], [f.peek()]];

    }

}
