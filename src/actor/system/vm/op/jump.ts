import { right } from '@quenk/noni/lib/data/either';
import { Context } from '../../../context';
import { Type, Location, Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import { OP_CODE_JUMP, OP_CODE_JUMP_IF_ONE, Log, Level, Op } from './';

/**
 * Jump to a new location.
 */
export class Jump<C extends Context, S extends System<C>> implements Op<C, S> {

    constructor(public location: number) { }

    public code = OP_CODE_JUMP;

    public level = Level.Base;

    exec(e: Runtime<C, S>) {

        let curr = e.current().get();

        curr
            .seek(this.location)
            .lmap(err => e.raise(err));

    }

    toLog(): Log {

        return ['jump', [this.location, Type.Number, Location.Literal], []];

    }

}

/**
 * JumpIfOne changes the current Frame's ip if the top value is one.
 *
 * Pops
 * 1. value to test.
 */
export class JumpIfOne<C extends Context, S extends System<C>>
    implements Op<C, S>{

    constructor(public location: number) { }

    code = OP_CODE_JUMP_IF_ONE;

    level = Level.Base;

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();

        curr
            .resolveNumber(curr.pop())
            .chain(n => {

                if (n === 1)
                    return curr.seek(this.location);

                return right(curr);

            })
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame<C, S>): Log {

        return ['jumpifone', [this.location, Type.Number, Location.Literal],
            [f.peek()]];

    }

}
