import { Context } from '../../../context';
import { System } from '../../';
import { Type, Location, Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_CALL, Log, Op, Level } from './';

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

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();
        let { actor, context, script, heap } = curr;

        let eitherFunc = curr.resolveFunction(curr.pop());

        if (eitherFunc.isLeft())
            return e.raise(eitherFunc.takeLeft());

        let f = eitherFunc.takeRight();

        let frm = new Frame(actor, context, script, f(), [], heap);

        for (let i = 0; i < this.args; i++) {

            let [value, type, location] = curr.pop();
            frm.push(value, type, location);

        }

        e.push(frm);

    }

    toLog(f: Frame<C, S>): Log {

        let data = [f.peek()];

        for (let i = 1; i <= this.args; i++)
            data.push((f.peek(i)));

        return ['call', [this.args, Type.Number, Location.Literal], data];

    }

}
