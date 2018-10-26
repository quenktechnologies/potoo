import * as log from '../log';
import { merge } from '@quenk/noni/lib/data/record';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Flags } from '../state';
import { System } from '../';
import { OP_FLAGS, Op } from './';

/**
 * Flag instruction.
 */
export class Flag extends Op {

    constructor(public address: Address, public flags: Flags) { super(); }

    public code = OP_FLAGS;

    public level = log.DEBUG;

    exec(s: System): void {

        return execFlags(s, this);


    }

}

/**
 * execFlags
 *
 * Changes the flags of an actor by merging.
 */
export const execFlags = (s: System, { address, flags }: Flag) =>
    s
        .actors
        .get(address)
        .map(f => {

            f.flags = merge(<any>f.flags, <any>flags);

        })
        .orJust(noop)
        .get();
