import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { System } from '../';
import { Frame } from '../state';
import { Run } from './run';
import { OP_RESTART, Op } from './';

/**
 * Restart instruction.
 */
export class Restart extends Op {

    constructor(public address: Address) { super(); }

    public code = OP_RESTART;

    public level = log.INFO;

    exec(s: System): void {

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
export const execRestart = (s: System, { address }: Restart) =>
    s
        .actors
        .get(address)
        .map(f => {

            f.actor.stop();

            s.actors.put(address, new Frame([], f.template.create(s),
                [], f.flags, f.template));

            s.exec(new Run(address, 'restart', f.template.delay || 0, () =>
                s.actors.runInstance(address)));

        })
        .orJust(noop)
        .get();
