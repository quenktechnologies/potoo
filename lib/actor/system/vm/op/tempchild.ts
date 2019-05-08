import * as error from '../error';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_TEMP_CHILD, Log, Op, Level } from './';

/**
 * TempChild copies a template's child onto the heap.
 *
 * Pops:
 * 1: Pointer to the template.
 * 2: Index of the child template.
 */
export class TempChild implements Op {

    public code = OP_CODE_TEMP_CHILD;

    public level = Level.Control;

    exec(e: Runtime): void {

        let curr = e.current().get();

        let eitherTemplate = curr.resolveTemplate(curr.pop());

        if (eitherTemplate.isLeft())
            return e.raise(eitherTemplate.takeLeft());

        let t = eitherTemplate.takeRight();

        let eitherNum = curr.resolveNumber(curr.pop());

        if (eitherNum.isLeft())
            return e.raise(eitherNum.takeLeft());

        let n = eitherNum.takeRight();

        if ((t.children && t.children.length > n) && (n > 0)) {

            let [value, type, location] =
                curr.allocateTemplate(t.children[n]);

            curr.push(value, type, location);

        } else {

            e.raise(new error.NullTemplatePointerErr(n));

        }

    }

    toLog(f: Frame): Log {

        return ['tempchild', [], [f.peek(), f.peek(1)]];

    }

}
