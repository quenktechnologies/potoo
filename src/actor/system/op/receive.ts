import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Behaviour } from '../../';
import { System } from '../';
import { Check } from './check';
import { OP_RECEIVE, Op } from './';

/**
 * Receive instruction.
 */
export class Receive extends Op {

    constructor(
        public address: Address,
        public immutable: boolean,
        public behaviour: Behaviour) { super() }

    public code = OP_RECEIVE;

    public level = log.INFO;

    exec(s: System): void {

        return execReceive(s, this);

    }

}

/**
 * execReceive
 *
 * Currently only one pending receive is allowed at a time.
 */
export const execReceive = (s: System, { address, behaviour }: Receive) =>
    s
        .actors
        .get(address)
        .map(f =>
            f
                .behaviour
                .push(behaviour))
        .map(() => s.exec(new Check(address)))
        .map(noop)
        .orJust(noop)
        .get()
