import * as log from '../log';
import { Address } from '../../address';
import { Context } from '../../context';
import { Executor } from './';
import { Message } from '../../message';
import { System } from '../';
import { OP_DROP, Op } from './';

/**
 * Discard instruction.
 *
 * Drops a message from the system.
 */
export class Discard<C extends Context, S extends System<C>> extends Op<C, S> {

    constructor(
        public to: Address,
        public from: Address,
        public message: Message) { super(); }

    public code = OP_DROP;

    public level = log.WARN;

    exec(_: Executor<C, S>): void { }

}
