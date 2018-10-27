import * as log from '../log';
import * as template from '../../template';
import { noop } from '@quenk/noni/lib/data/function';
import { Err } from '../../err';
import { Address, getParent } from '../../address';
import {Frame} from '../state/frame';
import { System } from '../';
import { Restart } from './restart';
import { Stop } from './stop';
import { OP_RAISE, Op } from './';

/**
 * Raise instruction.
 */
export class Raise extends Op {

    constructor(
        public error: Err,
        public src: Address,
        public dest: Address) { super(); }

    public code = OP_RAISE;

    public level = log.ERROR;

    /**
     * exec Raise
     *
     * 
     */
  exec<F extends Frame>(s: System<F>): void {

        return execRaise(s, this);

    }

}

/**
 * execRaise
 *
 * If the actor template came with a trap we apply it to determine
 * what action to take, one of:
 * 1. Elevate the error to the parent actor.
 * 2. Ignore the error.
 * 3. Restart the actor.
 * 4. Stop the actor completely.
 *
 * If no trap is provided we do 1. until we hit the system actor.
 */
export const execRaise = 
  <F extends Frame>(s: System<F>, { error, src, dest }: Raise) =>
    s
        .state
        .getTemplate(dest)
        .map(t => {

            if (t.trap != null) {

                switch (t.trap(error)) {

                    case template.ACTION_RAISE:
                        s.exec(new Raise(error, src, getParent(dest)));
                        break;

                    case template.ACTION_IGNORE:
                        break;

                    case template.ACTION_RESTART:
                        s.exec(new Restart(src));
                        break;

                    case template.ACTION_STOP:
                        s.exec(new Stop(src));
                        break;

                    default:
                        break; //ignore

                }

            } else {

                s.exec(new Raise(error, src, getParent(dest)));

            }

        })
        .map(noop)
        .orJust(noop)
        .get();
