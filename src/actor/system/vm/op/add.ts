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
export class Add implements Op {

    public code = OP_CODE_ADD;

    public level = Level.Base;

    exec(e: Runtime) {

        let curr = e.current().get();

        let eitherA = curr.resolveNumber(curr.pop());

        let eitherB = curr.resolveNumber(curr.pop());

        if (eitherA.isLeft())
            return e.raise(eitherA.takeLeft());

        if (eitherB.isLeft())
            return e.raise(eitherB.takeLeft());

        curr.pushNumber(eitherA.takeRight() + eitherB.takeRight());

    }

    toLog(f: Frame): Log {

        return ['add', [], [f.peek(), f.peek(1)]];

    }

}
