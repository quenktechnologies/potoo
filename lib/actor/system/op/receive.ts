import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Behaviour } from '../../';
import { Context } from '../../context';
import { get } from '../state';
import { System } from '../';
import { Check } from './check';
import { OP_RECEIVE, Op, Executor } from './';

/**
 * Receive instruction.
 *
 * Allows an actor to receive exactly one message.
 * Currently only one pending receive is allowed at a time.
 */
export class Receive<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(
        public address: Address,
        public immutable: boolean,
        public behaviour: Behaviour) { super() }

    public code = OP_RECEIVE;

    public level = log.INFO;

    exec(s: Executor<C, S>): void {

        return execReceive(s, this);

    }

}

const execReceive = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, { address, behaviour }: Receive<C,S>) =>
    get(s.state, address)
        .map(f =>
            f
                .behaviour
                .push(behaviour))
        .map(() => s.exec(new Check(address)))
        .map(noop)
        .orJust(noop)
        .get()
