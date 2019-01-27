import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_CALL = 0x17;

/**
 * Call a function.
 *
 * Pops:
 * 1: The function reference from the top of the stack.
 * 2: N arguments to be pushed onto the new Frame's stack.
 */
export class Call<C extends Context, S extends System<C>> implements Op<C, S> {

    constructor(public args: number) { }

    public code = OP_CODE_CALL;

    public level = Level.Control;

    exec(e: Executor<C, S>): void {

        let work = e
            .current
            .resolveFunction(e.current.pop())
            .map(f => new Frame(
              e.current.actor,
                e.current.context,
                e.current.script,
                f(),
                [],
                e.current.heap));

        if (work.isLeft())
            return e.raise(work.takeLeft());

        let frm = work.takeRight();

        for (let i = 0; i < this.args; i++) {

            let [value, type, location] = e.current.pop();
            frm.push(value, type, location);

        }

        e.push(frm);

    }

    toLog(): string {

        return `call`;

    }

}
