import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Level, Op } from './';

export const OP_CODE_STORE = 0x11;

/**
 * Store the top most value on the stack in the locals array at the 
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
export class Store<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(public index: number) { super(); }

    code = OP_CODE_STORE;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.locals[this.index] = e.current.pop();

    }

    toLog(): string {

        return `store ${this.index}`;

    }

}
