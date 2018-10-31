import * as log from '../log';
import { Address } from '../../address';
import { Context } from '../state/context';
import { putRoute } from '../state';
import { OP_ROUTE, Op, Executor } from './';

/**
 * Route instruction.
 */
export class Route extends Op {

    constructor(public from: Address, public to: Address) { super(); }

    public code = OP_ROUTE;

    public level = log.INFO;

    exec<C extends Context>(s: Executor<C>): void {

        return execRoute(s, this);

    }

}

/**
 * execRoute 
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
export const execRoute =
    <C extends Context>(s: Executor<C>, { from, to }: Route) => {

        s.state = putRoute(s.state, from, to);

    }

