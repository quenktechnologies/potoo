import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_QUERY = 0xc;

/**
 * Query verifies whether an address has a valid Context within the system. 
 *
 * Pops:
 * 1. Address to query
 *
 * Pushes:
 * 1 on true, 0 otherwise.
 */
export class Query<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_QUERY;

    public level = Level.Control;

    exec(e: Executor<C, S>): void {

      //TODO: support routers
        e
            .current
            .resolveAddress(e.current.pop())
            .map(addr =>
                e
                    .getContext(addr)
                    .map(() => e.current.pushNumber(1))
                    .orJust(() => e.current.pushNumber(0)))
            .lmap(err => e.raise(err));

    }

    toLog(): string {

        return `query`;

    }

}
