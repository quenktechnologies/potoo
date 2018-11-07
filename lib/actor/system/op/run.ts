import * as log from '../log';
import { tick } from '@quenk/noni/lib/control/timer';
import { Address } from '../../address';
import { Context } from '../../context';
import { Executor } from './';
import { OP_RUN, Op } from './';

/**
 * Run instruction.
 */
export class Run<C extends Context> extends Op<C> {

    constructor(
        public tag: string,
        public actor: Address,
        public delay: number,
        public func: () => void) { super(); }

    public code = OP_RUN;

    public level = log.INFO;

    exec<C extends Context>(_: Executor<C>): void {

        return execRun(this);

    }

}

/**
 * execRun
 *
 * Runs a side-effectfull function in the "next-tick" or after
 * the duration provided.
 */
export const execRun = <C extends Context>({ func, delay }: Run<C>) => {

    if (delay === 0)
        tick(func)
    else
        setTimeout(func, delay);

}
