import * as error from '../error';
import { right, left } from '@quenk/noni/lib/data/either';
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

        curr
            .resolveTemplate(curr.pop())
            .chain(t =>
                curr
                    .resolveNumber(curr.pop())
                    .chain(n => {

                        if ((t.children && t.children.length > n) && (n > 0)) {

                            let [value, type, location] =
                                curr.allocateTemplate(t.children[n]);

                            return right(curr.push(value, type, location));

                        } else {

                            return left(new error.NullTemplatePointerErr(n));

                        }

                    }))
            .lmap(err => e.raise(err))

    }

    toLog(f: Frame): Log {

        return ['tempchild', [], [f.peek(), f.peek(1)]];

    }

}
