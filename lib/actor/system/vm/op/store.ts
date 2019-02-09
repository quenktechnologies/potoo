import { Context } from '../../../context';
import { Type, Location, Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import { OP_CODE_STORE, Log, Level, Op } from './';

/**
 * Store the top most value on the stack in the locals array at the 
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
export class Store<C extends Context, S extends System<C>> implements Op<C, S> {

    constructor(public index: number) { }

    code = OP_CODE_STORE;

    level = Level.Base;

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();

        curr.locals[this.index] = curr.pop();

    }

    toLog(f: Frame<C, S>): Log {

        return ['store', [this.index, Type.Number, Location.Literal], [f.peek()]];

    }

}
