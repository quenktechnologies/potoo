import * as log from '../log';
import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { OP_ROUTE, Op } from './';

/**
 * Route instruction.
 */
export class Route extends Op {

    constructor(public from: Address, public to: Address) { super(); }

    public code = OP_ROUTE;

    public level = log.INFO;

    exec<F extends Frame>(s: Executor<F>): void {

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
    <F extends Frame>(s: Executor<F>, { from, to }: Route) => {

        s
            .state
            .putRoute(from, to);

    }

