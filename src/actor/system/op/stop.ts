import * as log from '../log';
import {map} from '@quenk/noni/lib/data/record';
import {noop} from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { System } from '../';
import { Restart } from './restart';
import { OP_STOP, Op } from './';

/**
 * Stop instruction.
 */
export class Stop extends Op {

    constructor(public address: Address) { super(); }

    public code = OP_STOP;

    public level = log.WARN;

    exec(s: System): void {

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
export const execStop = (s: System, { address }: Stop) =>
    s
        .actors
        .get(address)
        .map(f => {

          map(s.actors.getChildFrames(address), (_,k) => 
            s.exec(new Stop(k)));

            if (f.template.restart) {

                s.exec(new Restart(address));

            } else {

                f.actor.stop();
                s.actors.remove(address);

            }
        })
.orJust(noop)
        .get();
