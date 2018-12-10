import * as log from '../log';
import * as template from '../../template';
import { noop } from '@quenk/noni/lib/data/function';
import { Err } from '@quenk/noni/lib/control/error';
import { Address, getParent } from '../../address';
import { Context } from '../../context';
import { getTemplate } from '../state';
import { Restart } from './restart';
import { Stop } from './stop';
import {System} from '../';
import { OP_RAISE, Op, Executor } from './';

/**
 * Raise instruction.
 *
 * Raises an error within the system.
 * If the actor template for the source actor came with a trap function,
 * we apply it to determine what action to take next.
 *
 * Which can be one of:
 * 1. Elevate the error to the parent actor.
 * 2. Ignore the error.
 * 3. Restart the actor.
 * 4. Stop the actor completely.
 *
 * If no trap is provided we do 1 until we hit the system actor which results
 * in the whole system crashing.
 */
export class Raise<C extends Context, S extends System<C>> extends Op<C,S> {

    constructor(
        public error: Err,
        public src: Address,
        public dest: Address) { super(); }

    public code = OP_RAISE;

    public level = log.ERROR;

    exec(s: Executor<C,S>): void {

        return execRaise(s, this);

    }

}

const execRaise =<C extends Context, S extends System<C>>
  (s: Executor<C,S>, { error, src, dest }: Raise<C,S>) =>
        getTemplate(s.state, dest)
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
