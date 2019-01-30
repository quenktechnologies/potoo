import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Executor } from '../';
import { Log, Op, Level } from './';

export const OP_CODE_DUP = 0x6;

/**
 * Dup duplicates the current value at the top of the stack.
 */
export class Dup<C extends Context, S extends System<C>> implements Op<C, S> {

    code = OP_CODE_DUP;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();
        let [value, type, location] = curr.pop();

        curr.push(value, type, location);
        curr.push(value, type, location);

    }

    toLog(f: Frame<C, S>): Log {

      return ['dup', [], [f.peek()]];

    }

}
