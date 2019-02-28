import { Context } from '../../../context';
import { Type, Location, Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import {OP_CODE_LOAD, Log, Level } from './';

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

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();
        let [value, type, location] = curr.locals[this.index];
        curr.push(value, type, location);

    }

    toLog(_: Frame<C, S>): Log {

        return ['load', [this.index, Type.Number, Location.Literal], []];

    }

}