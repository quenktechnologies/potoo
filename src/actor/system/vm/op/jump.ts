import { right } from '@quenk/noni/lib/data/either';
import { Context } from '../../../context';
import { System } from '../../';
import {Type, Location} from '../frame';
import { Executor } from '../';
import { Log, Level, Op } from './';

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
export class JumpIfZero<C extends Context, S extends System<C>>
    implements Op<C, S>{

    constructor(public location: number) { }

    code = OP_CODE_JUMP_IF_ZERO;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();

        curr
            .resolveNumber(curr.pop())
            .chain(n => {

                if (n === 0)
                    return curr.seek(this.location);

                return right(curr);

            })
            .lmap(err => e.raise(err));

    }

    toLog(): Log {

        return ['jump', [this.location, Type.Number, Location.Literal], []];

    }

}
