import * as log from '../log';
import { map } from '@quenk/noni/lib/data/record';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Restart } from './restart';
import { OP_STOP, Op } from './';

/**
 * Stop instruction.
 */
export class Stop extends Op {

    constructor(public address: Address) { super(); }

    public code = OP_STOP;

    public level = log.WARN;

    exec<F extends Frame>(s: Executor<F>): void {

        return execStop(s, this);

    }

}

/**
 * execStop
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 * Otherwised it is stopped and ejected from the system.
 */
export const execStop = <F extends Frame>(s: Executor<F>, { address }: Stop) =>
    s
        .state
        .get(address)
        .map(f => {

            map(s.state.getChildFrames(address), (_, k) =>
                s.exec(new Stop(k)));

            if (f.template.restart) {

                s.exec(new Restart(address));

            } else {

                f.actor.stop();
                s.state.remove(address);

            }
        })
        .orJust(noop)
        .get();
