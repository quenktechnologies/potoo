import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Executor } from '../';
import { Level } from './';

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

        let [value, type, location] = e.current.locals[this.index];
        e.current.push(value, type, location);

    }

    toLog(_: Frame<C, S>) {

        return `load ${this.index}`;

    }

}
