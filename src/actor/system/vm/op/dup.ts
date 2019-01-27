import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_DUP = 0x6;

/**
 * Dup duplicates the current value at the top of the stack.
 */
export class Dup<C extends Context, S extends System<C>> implements Op<C, S> {

    code = OP_CODE_DUP;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        let [value, type, location] = e.current.pop();

        e.current.push(value, type, location);
        e.current.push(value, type, location);

    }

    toLog(): string {

        return `dup`;

    }

}
