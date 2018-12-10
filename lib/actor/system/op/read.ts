import * as log from '../log';
import { fromArray } from '@quenk/noni/lib/data/maybe';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { get } from '../state';
import { Discard } from './discard';
import { System} from '../';
import { OP_READ, Op, Executor } from './';

/**
 * Read instruction.
 *
 * Applies the actor behaviour in the "next tick" if a 
 * pending receive is discovered.
 */
export class Read<C extends Context, S extends System<C>> extends Op<C,S> {

    constructor(
        public address: Address,
        public envelope: Envelope) { super(); }

    public code = OP_READ

    public level = log.INFO;

    exec(s: Executor<C,S>): void {

        return execRead(s, this);

    }

}

 const execRead = <C extends Context, S extends System<C>>
  (s: Executor<C,S>, { address, envelope }: Read<C,S>) =>
        get(s.state, address)
            .chain(consume(s, envelope))
            .orJust(noop)
            .map(noop)
            .get();

const consume = <C extends Context, S extends System<C>>
  (s: Executor<C,S>, e: Envelope) => (f: C) =>
    fromArray(f.behaviour)
        .map(([b]) => b)
        .chain(b =>
            b(e.message)
                .map(() => {

                    if (!f.flags.immutable)
                        f.behaviour.shift();

                })
                .orRight(() => {

                    s.exec(new Discard(e.to, e.from, e.message));

                })
                .toMaybe())
