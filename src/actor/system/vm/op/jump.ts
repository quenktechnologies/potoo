import { right } from '@quenk/noni/lib/data/either';
import { Type, Location, Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_JUMP, OP_CODE_JUMP_IF_ONE, Log, Level, Op } from './';

/**
 * Jump to a new location.
 */
export class Jump implements Op {

    constructor(public location: number) { }

    public code = OP_CODE_JUMP;

    public level = Level.Base;

    exec(e: Runtime) {

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
export class JumpIfOne implements Op {

    constructor(public location: number) { }

    code = OP_CODE_JUMP_IF_ONE;

    level = Level.Base;

    exec(e: Runtime): void {

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

    toLog(f: Frame): Log {

        return ['jumpifone', [this.location, Type.Number, Location.Literal],
            [f.peek()]];

    }

}
