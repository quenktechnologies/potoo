import { Context } from '../../../context';
import { System } from '../../../system';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_ADD, Log, Level, Op } from './';

/**
 * Add the top two operands of the stack.
 *
 * Pops:
 * 1. The first value.
 * 2. The second value.
 *
 * Pushes:
 *
 * The result of adding the two numbers.
 */
export class Add<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_ADD;

    public level = Level.Base;

    exec(e: Runtime<C, S>) {

        let curr = e.current().get();

        curr
            .resolveNumber(curr.pop())
            .chain(a =>
                curr
                    .resolveNumber(curr.pop())
                    .map(b => curr.pushNumber(a + b)))
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame<C, S>): Log {

        return ['add', [], [f.peek(), f.peek(1)]];

    }

}
