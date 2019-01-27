import * as error from '../error';
import { right, left } from '@quenk/noni/lib/data/either';
import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_TEMP_CHILD = 0x16;

/**
 * TempChild copies a template's child onto the heap.
 *
 * Pops:
 * 1: Pointer to the template.
 * 2: Index of the child template.
 */
export class TempChild<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_TEMP_CHILD;

    public level = Level.Control;

    exec(e: Executor<C, S>): void {

        e
            .current
            .resolveTemplate(e.current.pop())
            .chain(t =>
                e
                    .current
                    .resolveNumber(e.current.pop())
                    .chain(n => {

                        if ((t.children && t.children.length > n) && (n > 0)) {

                            let [value, type, location] =
                                e.current.allocateTemplate(t.children[n]);

                            return right(e.current.push(value, type, location));

                        } else {

                            return left(new error.NullTemplatePointerErr(n));

                        }

                    }))
            .lmap(err => e.raise(err))

    }

    toLog(): string {

        return `tempchild`;

    }

}
