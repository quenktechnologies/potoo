import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Run } from './run';
import { Tell } from './tell';
import { OP_RESTART, Op } from './';

/**
 * Restart instruction.
 */
export class Restart extends Op {

    constructor(public address: Address) { super(); }

    public code = OP_RESTART;

    public level = log.INFO;

    exec<F extends Frame>(s: Executor<F>): void {

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
    <F extends Frame>(s: Executor<F>, op: Restart) =>
        s
            .state
            .get(op.address)
            .map(doRestart(s, op))
            .orJust(noop)
            .get();

const doRestart =
    <F extends Frame>(s: Executor<F>, { address }: Restart) => (f: F) => {

        f.actor.stop();

        s.state.put(address, s.allocate(f.template));

        s.exec(new Run(address, 'restart',
            f.template.delay || 0, () => s.state.runInstance(address)));

        f
            .mailbox
            .map(m => m.map(e => s.exec(new Tell(e.to, e.from, e.message))));

    }
