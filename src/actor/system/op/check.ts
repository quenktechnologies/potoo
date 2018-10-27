import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Frame } from '../state/frame';
import { System } from '../';
import { Read } from './read';
import { OP_CHECK, Op } from './';

/**
 * Check instruction.
 */
export class Check extends Op {

    constructor(public address: Address) { super(); }

    public code = OP_CHECK;

    public level = log.INFO;

    exec<F extends Frame>(s: System<F>): void {

        return execCheck(s, this);

    }

}

/**
 * execCheck 
 *
 * Peeks at the actors mailbox for new messages and 
 * schedules a Read if for the oldest one.
 */
export const execCheck = <F extends Frame>(s: System<F>, { address }: Check) =>
    s
        .state
        .getBehaviour(address)
        .chain(() => s.state.getMessage(address))
        .map(e => s.exec(new Read(address, e)))
        .map(noop)
        .orJust(noop)
        .get();

