import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Context } from '../../context';
import { put, runInstance, get } from '../state';
import { Run } from './run';
import { Tell } from './tell';
import { OP_RESTART, Op, Executor } from './';

/**
 * Restart instruction.
 */
export class Restart<C extends Context> extends Op<C> {

    constructor(public address: Address) { super(); }

    public code = OP_RESTART;

    public level = log.INFO;

    exec(s: Executor<C>): void {

        return execRestart(s, this);

    }

}

/**
 * execRestart
 *
 * Retains the actor's mailbox and stops the current instance.
 * It is then restart by creating a new instance and invoking its
 * run method.
 */
export const execRestart =
  <C extends Context>(s: Executor<C>, op: Restart<C>) =>
        get(s.state, op.address)
            .map(doRestart(s, op))
            .orJust(noop)
            .get();

const doRestart =
  <C extends Context>(s: Executor<C>, { address }: Restart<C>) => (f: C) => {

        f.actor.stop();

        s.state = put(s.state, address, s.allocate(f.template));

        s.exec(new Run(address, 'restart',
            f.template.delay || 0, () => runInstance(s.state, address)));

        f
            .mailbox
            .map(m => m.map(e => s.exec(new Tell(e.to, e.from, e.message))));

    }
