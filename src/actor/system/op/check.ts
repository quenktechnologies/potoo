import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Context } from '../../context';
import { getMessage, getBehaviour } from '../state';
import { Read } from './read';
import { System } from '../';
import { OP_CHECK, Op, Executor } from './';

/**
 * Check instruction.
 *
 * Peeks at the actors mailbox for new messages and 
 * schedules a Read if any found.
 */
export class Check<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(public address: Address) { super(); }

    public code = OP_CHECK;

    public level = log.INFO;

    exec(s: Executor<C, S>): void {

        return execCheck(s, this);

    }

}

const execCheck = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, { address }: Check<C, S>) =>
    getBehaviour(s.state, address)
        .chain(() => getMessage(s.state, address))
        .map(e => s.exec(new Read(address, e)))
        .map(noop)
        .orJust(noop)
        .get();
