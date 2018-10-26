import * as log from '../log';
import { fromArray } from '@quenk/noni/lib/data/maybe';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Envelope } from '../mailbox';
import { System } from '../';
import { Frame } from '../state';
import { Drop } from './drop';
import { OP_READ, Op } from './';

/**
 * Read instruction.
 */
export class Read extends Op {

    constructor(
        public address: Address,
        public envelope: Envelope) { super(); }

    public code = OP_READ

    public level = log.INFO;

    exec(s: System): void {

        return execRead(s, this);

    }

}

/**
 * execRead 
 *
 * Applies the actor behaviour in the "next tick" if a 
 * receive is pending.
 */
export const execRead = (s: System, { address, envelope }: Read) =>
    s
        .actors
        .get(address)
        .chain(consume(s, envelope))
        .orJust(noop)
        .map(noop)
        .get();

const consume = (s: System, e: Envelope) => (f: Frame) =>
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
