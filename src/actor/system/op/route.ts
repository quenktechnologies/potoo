import * as log from '../log';
import { Address } from '../../address';
import { System } from '../';
import { OP_ROUTE, Op } from './';

/**
 * Route instruction.
 */
export class Route extends Op {

    constructor(public from: Address, public to: Address) { super(); }

    public code = OP_ROUTE;

    public level = log.INFO;

    exec(s: System): void {

        return execRoute(s, this);

    }

}

/**
 * execRoute 
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
export const execRoute = (s: System, { from, to }: Route) => {

    s
        .actors
        .putRoute(from, to);

}

