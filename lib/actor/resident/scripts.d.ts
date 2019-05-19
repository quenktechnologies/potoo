import { Foreign, Script } from '../system/vm/script';
import { Address } from '../address';
import { Message } from '../message';
/**
 * AcceptScript for discarding messages.
 */
export declare class AcceptScript extends Script {
    msg: Message;
    constructor(msg: Message);
}
export { AcceptScript as DropScript };
/**
 * TellScript for sending messages.
 */
export declare class TellScript extends Script {
    to: Address;
    msg: Message;
    constructor(to: Address, msg: Message);
}
/**
 * ReceiveScript
 */
export declare class ReceiveScript extends Script {
    func: Foreign;
    constructor(func: Foreign);
}
/**
 * NotifyScript
 */
export declare class NotifyScript extends Script {
    constructor();
}
/**
 * RaiseScript
 */
export declare class RaiseScript extends Script {
    msg: Message;
    constructor(msg: Message);
}
