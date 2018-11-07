import * as log from '../log';
import { Address } from '../../address';
import { Context } from '../../context';
import { Executor } from './';
import { Message } from '../../message';
import { OP_DROP, Op } from './';

/**
 * Drop instruction.
 */
export class Drop<C extends Context> extends Op<C> {

    constructor(
        public to: Address,
        public from: Address,
        public message: Message) { super(); }

    public code = OP_DROP;

    public level = log.WARN;

    exec<C extends Context>(_: Executor<C>): void { }

}
