import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
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

    exec(s: System): void {

        return execCheck(s, this);

    }

}

/**
 * execCheck 
 *
 * Peeks at the actors mailbox for new messages and 
 * schedules a Read if for the oldest one.
 */
export const execCheck = (s: System, { address }: Check) =>
    s
        .actors
        .getBehaviour(address)
  .chain(()=> s.actors.getMessage(address))
        .map(e => s.exec(new Read(address, e)))
        .map(noop)
        .orJust(noop)
        .get();

