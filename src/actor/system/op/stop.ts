import * as log from '../log';
import { map } from '@quenk/noni/lib/data/record';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Context } from '../../context';
import { getChildren, remove, get } from '../state';
import {System} from '../';
import { Restart } from './restart';
import { OP_STOP, Op, Executor } from './';

/**
 * Stop instruction.
 *
 * Halts an actor and removes it from the system.
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 */
export class Stop<C extends Context, S extends System<C>> extends Op<C,S> {

    constructor(public address: Address) { super(); }

    public code = OP_STOP;

    public level = log.WARN;

    exec(s: Executor<C,S>): void {

        return execStop(s, this);

    }

}

const execStop = <C extends Context, S extends System<C>>
  (s: Executor<C,S>, { address }: Stop<C,S>) =>
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
