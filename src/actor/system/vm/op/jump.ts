import {right} from '@quenk/noni/lib/data/either';
import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Level } from './';

export const OP_CODE_JUMP_IF_ZERO = 0x8;

/**
 * JumpIfZero changes the Context's instruction pointer to the value supplied
 * if the top of the stack is strictly equal to zero
 *
 * Pops
 * 1. value to test.
 *
 * Raises:
 * JumpOutOfBoundsErr
 */
export class JumpIfZero<C extends Context, S extends System<C>> {

    constructor(public location: number) { }

    code = OP_CODE_JUMP_IF_ZERO;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

              e
                .current
                .resolveNumber(e.current.pop())
                .chain(n => {

                    if (n === 0)
                    return e.current.seek(this.location);

                  return right(e.current);

                })
                .lmap(err => e.raise(err));

        }

    toLog(): string {

        return `jump ${this.location}`

    }

}
