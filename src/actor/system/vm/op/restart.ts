import { Runtime } from '../runtime';
import { OP_CODE_RESTART, Log, Op, Level } from './';

/**
 * Restart the current actor.
 */
export class Restart implements Op {

    public code = OP_CODE_RESTART;

    public level = Level.Control;

    exec(e: Runtime): void {

        let curr = e.current().get();

        e
            .getContext(curr.actor)
            .map(ctx => {

                e.clear();

                ctx.actor.stop();

                let nctx = e.allocate(curr.actor, ctx.template);

                nctx.mailbox = ctx.mailbox;

                e.putContext(curr.actor, nctx);

            });

    }

    toLog(): Log {

        return ['restart', [], []];

    }

}
