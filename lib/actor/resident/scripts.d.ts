import { ForeignFunInfo } from '../system/vm/script/info';
import { Script, Constants } from '../system/vm/script';
import { Template } from '../template';
import { System } from '../system';
import { Address } from '../address';
import { Message } from '../message';
/**
 * Spawn spawns a single child actor from a template.
 */
export declare class Spawn implements Script {
    template: Template<System>;
    constructor(template: Template<System>);
    constants: Constants;
    info: ForeignFunInfo[];
    code: number[];
}
/**
 * Tell used to deliver messages to other actors.
 */
export declare class Tell implements Script {
    to: Address;
    msg: Message;
    constructor(to: Address, msg: Message);
    constants: Constants;
    info: ForeignFunInfo[];
    code: number[];
}
/**
 * Receive schedules a receiver for the actor.
 */
export declare class Receive implements Script {
    f: Function;
    constructor(f: Function);
    constants: Constants;
    info: ForeignFunInfo[];
    code: number[];
}
/**
 * Notify attempts to consume the next available message in the mailbox.
 */
export declare class Notify implements Script {
    constants: Constants;
    info: never[];
    code: number[];
}
