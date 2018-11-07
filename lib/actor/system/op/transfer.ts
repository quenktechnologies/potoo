import * as log from '../log';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Message } from '../../message';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { getInstance } from '../state';
import { Drop } from './drop';
import { OP_TRANSFER, Op, Executor } from './';

/**
 * Transfer instruction.
 */
export class Transfer<C extends Context> extends Op<C> {

    constructor(
        public to: Address,
        public from: Address,
        public router: Address,
        public message: Message) { super(); }

    public code = OP_TRANSFER;

    public level = log.DEBUG;

    exec(s: Executor<C>): void {

        return execTransfer(s, this);

    }

}

/**
 * execTransfer 
 *
 * Peeks at the actors mailbox for new messages and 
 * schedules a Read if for the oldest one.
 */
export const execTransfer =
  <C extends Context>(s: Executor<C>, { router, to, from, message }: Transfer<C>) =>
        getInstance(s.state, router)
            .map(a => a.accept(new Envelope(to, from, message)))
            .orJust(() => s.exec(new Drop(to, from, message)))
            .map(noop)
            .get();
