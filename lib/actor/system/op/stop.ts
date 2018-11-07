import * as log from '../log';
import { map } from '@quenk/noni/lib/data/record';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Context } from '../../context';
import { getChildren, remove, get } from '../state';
import { Restart } from './restart';
import { OP_STOP, Op, Executor } from './';

/**
 * Stop instruction.
 */
export class Stop<C extends Context> extends Op<C> {

    constructor(public address: Address) { super(); }

    public code = OP_STOP;

    public level = log.WARN;

    exec(s: Executor<C>): void {

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
export const execStop = <C extends Context>(s: Executor<C>, { address }: Stop<C>) =>
    get(s.state, address)
        .map(f => {

            map(getChildren(s.state, address), (_, k) =>
                s.exec(new Stop(k)));

            if (f.template.restart) {

                s.exec(new Restart(address));

            } else {

                f.actor.stop();
                s.state = remove(s.state, address);

            }
        })
        .orJust(noop)
        .get();
