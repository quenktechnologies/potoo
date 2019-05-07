import { Type, Location, Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_STORE, Log, Level, Op } from './';

/**
 * Store the top most value on the stack in the locals array at the 
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
export class Store implements Op {

    constructor(public index: number) { }

    code = OP_CODE_STORE;

    level = Level.Base;

    exec(e: Runtime): void {

        let curr = e.current().get();

        curr.locals[this.index] = curr.pop();

    }

    toLog(f: Frame): Log {

        return ['store', [this.index, Type.Number, Location.Literal], [f.peek()]];

    }

}
