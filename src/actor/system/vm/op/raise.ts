import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_RAISE = 0x21;

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

        e
            .current
            .resolveMessage(e.current.pop())
            .map(m => e.raise(m))
            .lmap(err => e.raise(err));

    }

    toLog(): string {

        return 'raise';

    }

}

