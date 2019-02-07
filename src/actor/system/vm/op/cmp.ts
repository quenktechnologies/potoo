import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import { OP_CODE_CMP, Log, Level, Op } from './';

/**
 * Cmp compares the top two values for equality.
 *
 * Pops:
 *
 * 1. Left value.
 * 2. Right value.
 *
 * Pushes:
 *
 * 1 if true, 0 if false
 */
export class Cmp<C extends Context, S extends System<C>> implements Op<C, S>{

    public code = OP_CODE_CMP;

    public level = Level.Base;

    exec(e: Runtime<C, S>) {

        let curr = e.current().get();

        curr
            .resolve(curr.pop())
            .chain(a =>
                curr
                    .resolve(curr.pop())
                    .map(b => {

                        if (a === b)
                            curr.pushNumber(1);
                        else
                            curr.pushNumber(0);

                    }))
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame<C, S>): Log {

        return ['cmp', [], [f.peek(), f.peek(1)]];

    }

}
