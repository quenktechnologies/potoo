import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Frame } from '../state/frame';
import { getMessage, getBehaviour } from '../state';
import { Read } from './read';
import { OP_CHECK, Op, Executor } from './';

/**
 * Check instruction.
 */
export class Check extends Op {

    constructor(public address: Address) { super(); }

    public code = OP_CHECK;

    public level = log.INFO;

    exec<F extends Frame>(s: Executor<F>): void {

        return execCheck(s, this);

    }

}

/**
 * execCheck 
 *
 * Peeks at the actors mailbox for new messages and 
 * schedules a Read if for the oldest one.
 */
export const execCheck = <F extends Frame>(s: Executor<F>, { address }: Check) =>
        getBehaviour(s.state,address)
        .chain(() => getMessage(s.state, address))
        .map(e => s.exec(new Read(address, e)))
        .map(noop)
        .orJust(noop)
        .get();

