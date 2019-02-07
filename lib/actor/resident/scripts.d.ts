import { Foreign, Script } from '../system/vm/script';
import { System } from '../system';
import { Context } from '../context';
import { Address } from '../address';
import { Message } from '../message';
/**
 * AcceptScript for discarding messages.
 */
export declare class AcceptScript<C extends Context, S extends System<C>> extends Script<C, S> {
    msg: Message;
    constructor(msg: Message);
}
export { AcceptScript as DropScript };
/**
 * TellScript for sending messages.
 */
export declare class TellScript<C extends Context, S extends System<C>> extends Script<C, S> {
    to: Address;
    msg: Message;
    constructor(to: Address, msg: Message);
}
/**
 * ReceiveScript
 */
export declare class ReceiveScript<C extends Context, S extends System<C>> extends Script<C, S> {
    func: Foreign<C, S>;
    constructor(func: Foreign<C, S>);
}
/**
 * NotifyScript
 */
export declare class NotifyScript<C extends Context, S extends System<C>> extends Script<C, S> {
    constructor();
}
