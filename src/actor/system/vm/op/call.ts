import { Context } from '../../../context';
import { System } from '../../';
import { Type, Location, Frame } from '../frame';
import { Executor } from '../';
import { Log, Op, Level } from './';

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

        let curr = e.current().get();
        let { actor, context, script, heap } = curr;

        let work =
            curr
                .resolveFunction(curr.pop())
                .map(f => new Frame(actor, context, script, f(), [], heap));

        if (work.isLeft())
            return e.raise(work.takeLeft());

        let frm = work.takeRight();

        for (let i = 0; i < this.args; i++) {

            let [value, type, location] = curr.pop();
            frm.push(value, type, location);

        }

        e.push(frm);

        let [value, type, location] = frm.pop();

        curr.push(value, type, location); //return

    }

    toLog(f: Frame<C, S>): Log {

        let data = [f.peek()];

        for (let i = 1; i <= this.args; i++)
            data.push((f.peek(i)));

        return ['call', [this.args, Type.Number, Location.Literal], data];

    }

}
