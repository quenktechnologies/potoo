import * as log from '../log';
import { Address } from '../../address';
import { Context } from '../../context';
import { putRoute } from '../state';
import { OP_FORWARD, Op, Executor } from './';

/**
 * Forward instruction.
 */
export class Forward<C extends Context> extends Op<C> {

    constructor(public from: Address, public to: Address) { super(); }

    public code = OP_FORWARD;

    public level = log.INFO;

    exec<C extends Context>(s: Executor<C>): void {

        return execForward(s, this);

    }

}

/**
 * execForward 
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
export const execForward =
    <C extends Context>(s: Executor<C>, { from, to }: Forward<C>) => {

        s.state = putRoute(s.state, from, to);

    }

