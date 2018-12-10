import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Message } from '../../message';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { getInstance } from '../state';
import {System} from '../';
import { Discard } from './discard';
import { OP_TRANSFER, Op, Executor } from './';

/**
 * Transfer instruction.
 *
 * Transfers a message.
 */
export class Transfer<C extends Context, S extends System<C>> extends Op<C,S> {

    constructor(
        public to: Address,
        public from: Address,
        public router: Address,
        public message: Message) { super(); }

    public code = OP_TRANSFER;

    public level = log.DEBUG;

    exec(s: Executor<C,S>): void {

        return execTransfer(s, this);

    }

}

 const execTransfer =  <C extends Context, S extends System<C>>
  (s: Executor<C,S>, { router, to, from, message }: Transfer<C,S>) =>
        getInstance(s.state, router)
            .map(a => a.accept(new Envelope(to, from, message)))
            .orJust(() => s.exec(new Discard(to, from, message)))
            .map(noop)
            .get();
