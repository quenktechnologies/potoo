import * as log from '../log';
import { Address } from '../../address';
import { Frame } from '../state/frame';
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

  exec<F extends Frame>(_: System<F>): void {

    }

}

