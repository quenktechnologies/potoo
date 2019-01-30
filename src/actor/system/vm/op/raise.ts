import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Executor } from '../';
import { OP_CODE_RAISE,Log, Op, Level } from './';

/**
 * Raise instruction.
 *
 * Raises an error within the system.
 * If the actor template for the source actor came with a trap function,
 * we apply it to determine what action to take next.
 *
 * Which can be one of:
 * 1. Elevate the error to the parent actor.
 * 2. Ignore the error.
 * 3. Restart the actor.
 * 4. Stop the actor completely.
 *
 * If no trap is provided we do 1 until we hit the system actor which results
 * in the whole system crashing.
 *
 * Pops:
 * 1. Message indicating an error.
 */
export class Raise<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_RAISE;

    public level = Level.System;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();

        curr
            .resolveMessage(curr.pop())
            .map(m => e.raise(m))
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame<C, S>): Log {

        return ['raise', [], [f.peek()]];

    }

}

