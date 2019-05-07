import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_DUP, Log, Op, Level } from './';

/**
 * Dup duplicates the current value at the top of the stack.
 */
export class Dup implements Op {

    code = OP_CODE_DUP;

    level = Level.Base;

    exec(e: Runtime): void {

        let curr = e.current().get();
        let [value, type, location] = curr.pop();

        curr.push(value, type, location);
        curr.push(value, type, location);

    }

    toLog(f: Frame): Log {

        return ['dup', [], [f.peek()]];

    }

}
