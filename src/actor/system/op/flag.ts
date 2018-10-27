import * as log from '../log';
import { merge } from '@quenk/noni/lib/data/record';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Flags, Frame } from '../state/frame';
import { System } from '../';
import { OP_FLAGS, Op } from './';

/**
 * Flag instruction.
 */
export class Flag extends Op {

    constructor(public address: Address, public flags: Flags) { super(); }

    public code = OP_FLAGS;

    public level = log.DEBUG;

    exec<F extends Frame>(s: System<F>): void {

        return execFlags(s, this);


    }

}

/**
 * execFlags
 *
 * Changes the flags of an actor by merging.
 */
export const execFlags =
    <F extends Frame>(s: System<F>, { address, flags }: Flag) =>
        s
            .state
            .get(address)
            .map(f => { f.flags = merge(f.flags, flags); })
            .orJust(noop)
            .get();
