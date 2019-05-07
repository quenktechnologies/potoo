import { tick } from '@quenk/noni/lib/control/timer';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_RUN, Log, Op, Level } from './';

/**
 * Run invokes the run method of an actor given the address.
 * 
 * Pops
 * 1. The address of the current actor or child to be run.
 */
export class Run implements Op {

    public code = OP_CODE_RUN;

    public level = Level.Control;

    exec(e: Runtime): void {

        let curr = e.current().get();

        curr
            .resolveAddress(curr.pop())
            .map(addr => {
                e
                    .getContext(addr)
                    .map(ctx => tick(() => ctx.actor.run()))
            })
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame): Log {

        return ['run', [], [f.peek()]];

    }

}
