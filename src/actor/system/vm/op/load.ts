import { Context } from '../../../context';
import { System } from '../../';
import { Type, Location, Frame } from '../frame';
import { Executor } from '../';
import { Log, Level } from './';

export const OP_CODE_LOAD = 0x12;

/**
 * Load the local stored at index onto the stack.
 *
 * Pushes:
 * 1. Value of index in locals table.
 */
export class Load<C extends Context, S extends System<C>> {

    constructor(public index: number) { }

    code = OP_CODE_LOAD;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();
        let [value, type, location] = curr.locals[this.index];
        curr.push(value, type, location);

    }

    toLog(f: Frame<C, S>): Log {

        return ['load', [this.index, Type.Number, Location.Literal],[f.peek()]];

    }

}
