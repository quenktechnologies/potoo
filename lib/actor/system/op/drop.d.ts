import { Address } from '../../address';
import { Context } from '../state/context';
import { Executor } from './';
import { Message } from '../../message';
import { Op } from './';
/**
 * Drop instruction.
 */
export declare class Drop extends Op {
    to: Address;
    from: Address;
    message: Message;
    constructor(to: Address, from: Address, message: Message);
    code: number;
    level: number;
    exec<C extends Context>(_: Executor<C>): void;
}
