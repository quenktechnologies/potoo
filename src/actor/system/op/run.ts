import * as log from '../log';
import { tick } from '@quenk/noni/lib/control/timer';
import {Address} from '../../address';
import {Frame} from '../state/frame';
import { System } from '../';
import { OP_RUN, Op } from './';

/**
 * Run instruction.
 */
export class Run extends Op {

    constructor(
        public tag: string,
      public actor: Address,
        public delay: number,
        public func: () => void) { super(); }

    public code = OP_RUN;

    public level = log.INFO;

  exec<F extends Frame>(_: System<F>): void {

        return execRun(this);

    }

}

/**
 * execRun
 *
 * Runs a side-effectfull function in the "next-tick" or after
 * the duration provided.
 */
export const execRun = ({ func, delay }: Run) => {

    if (delay === 0)
        tick(func)
    else
        setTimeout(func, delay);

}
