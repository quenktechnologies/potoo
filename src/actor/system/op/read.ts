import * as log from '../log';
import { fromArray } from '@quenk/noni/lib/data/maybe';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Envelope } from '../mailbox';
import { Frame } from '../state/frame';
import {get} from '../state';
import { Drop } from './drop';
import { OP_READ, Op, Executor } from './';

/**
 * Read instruction.
 */
export class Read extends Op {

    constructor(
        public address: Address,
        public envelope: Envelope) { super(); }

    public code = OP_READ

    public level = log.INFO;

    exec<F extends Frame>(s: Executor<F>): void {

        return execRead(s, this);

    }

}

/**
 * execRead 
 *
 * Applies the actor behaviour in the "next tick" if a 
 * receive is pending.
 */
export const execRead =
    <F extends Frame>(s: Executor<F>, { address, envelope }: Read) =>
            get(s.state,address)
            .chain(consume(s, envelope))
            .orJust(noop)
            .map(noop)
            .get();

const consume = <F extends Frame>(s: Executor<F>, e: Envelope) => (f: F) =>
    fromArray(f.behaviour)
        .map(([b]) => b)
        .chain(b =>
            b(e.message)
                .map(() => {

                    if (!f.flags.immutable)
                        f.behaviour.shift();

                })
                .orRight(() => {

                    s.exec(new Drop(e.to, e.from, e.message));

                })
                .toMaybe())
