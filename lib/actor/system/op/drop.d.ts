import { Address } from '../../address';
import { System } from '../';
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
    exec(_: System): void;
}
