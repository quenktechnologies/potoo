import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Context } from '../../context';
import { put, runInstance, get } from '../state';
import { System } from '../';
import { Run } from './run';
import { Tell } from './tell';
import { OP_RESTART, Op, Executor } from './';

/**
 * Restart instruction.
 *
 * Re-creates a new instance of an actor maintaining the state of its mailbox.
 */
export class Restart<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(public address: Address) { super(); }

    public code = OP_RESTART;

    public level = log.INFO;

    exec(s: Executor<C, S>): void {

        return execRestart(s, this);

    }

}

const execRestart = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, op: Restart<C, S>) =>
    get(s.state, op.address)
        .map(doRestart(s, op))
        .orJust(noop)
        .get();

const doRestart =    <C extends Context, S extends System<C>>
  (s: Executor<C,S>, { address }: Restart<C,S>) => (f: C) => {

        f.actor.stop();

        s.state = put(s.state, address, s.allocate(f.template));

        s.exec(new Run(address, 'restart',
            f.template.delay || 0, () => runInstance(s.state, address)));

        f
            .mailbox
            .map(m => m.map(e => s.exec(new Tell(e.to, e.from, e.message))));

    }
