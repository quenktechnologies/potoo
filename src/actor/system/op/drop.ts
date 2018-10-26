import * as log from '../log';
import { Address } from '../../address';
import { System } from '../';
import { Message } from '../../message';
import { OP_DROP, Op } from './';

/**
 * Drop instruction.
 */
export class Drop extends Op {

    constructor(
        public to: Address,
        public from: Address,
        public message: Message) { super(); }

    public code = OP_DROP;

    public level = log.WARN;

    exec(_: System): void {

    }

}

