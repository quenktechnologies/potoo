import * as log from '../log';
import { Address } from '../../address';
import { Context } from '../../context';
import { putRoute } from '../state';
import { System } from '../';
import { OP_FORWARD, Op, Executor } from './';

/**
 * Forward instruction.
 *
 * Creates an entry in the system's routing table to allow
 * any messages bound for a address prefix to be forwarded to
 * another actor.
 */
export class Forward<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(public from: Address, public to: Address) { super(); }

    public code = OP_FORWARD;

    public level = log.INFO;

    exec(s: Executor<C, S>): void {

        return execForward(s, this);

    }

}

const execForward = <C extends Context, S extends System<C>>
    (s: Executor<C, S>, { from, to }: Forward<C, S>) => {

    s.state = putRoute(s.state, from, to);

}
