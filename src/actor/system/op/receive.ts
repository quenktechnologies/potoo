import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Behaviour } from '../../';
import { Context } from '../../context';
import { get } from '../state';
import { Check } from './check';
import { OP_RECEIVE, Op, Executor } from './';

/**
 * Receive instruction.
 */
export class Receive<C extends Context> extends Op<C> {

    constructor(
        public address: Address,
        public immutable: boolean,
        public behaviour: Behaviour) { super() }

    public code = OP_RECEIVE;

    public level = log.INFO;

    exec(s: Executor<C>): void {

        return execReceive(s, this);

    }

}

/**
 * execReceive
 *
 * Currently only one pending receive is allowed at a time.
 */
export const execReceive =
  <C extends Context>(s: Executor<C>, { address, behaviour }: Receive<C>) =>
        get(s.state, address)
            .map(f =>
                f
                    .behaviour
                    .push(behaviour))
            .map(() => s.exec(new Check(address)))
            .map(noop)
            .orJust(noop)
            .get()
