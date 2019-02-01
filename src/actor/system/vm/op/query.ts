import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_QUERY,Log, Op, Level } from './';

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

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();

        let eitherAddr = curr.resolveAddress(curr.pop());

        if (eitherAddr.isLeft())
            return e.raise(eitherAddr.takeLeft());

        let addr = eitherAddr.takeRight();

        let maybe = e
            .getRouter(addr)
            .orElse(() => e.getContext(addr));

        if (maybe.isJust())
            curr.pushNumber(1)
        else
            curr.pushNumber(0);

    }

    toLog(f: Frame<C, S>): Log {

        return ['query', [], f.peek()];

    }

}
