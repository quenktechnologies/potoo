import * as log from '../log';
import { tick } from '@quenk/noni/lib/control/timer';
import { Address } from '../../address';
import { Context } from '../../context';
import { System } from '../';
import { Executor } from './';
import { OP_RUN, Op } from './';

/**
 * Run instruction.
 *
 * Runs a side-effectfull function in the "next-tick" or after
 * the duration provided.
 */
export class Run<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(
        public tag: string,
        public actor: Address,
        public delay: number,
        public func: () => void) { super(); }

    public code = OP_RUN;

    public level = log.INFO;

    exec(_: Executor<C, S>): void {

        return execRun(this);

    }

}

const execRun = <C extends Context, S extends System<C>>
    ({ func, delay }: Run<C, S>) => {

    if (delay === 0)
        tick(func)
    else
        setTimeout(func, delay);

}
