import { ForeignFunInfo, NewForeignFunInfo, NewFunInfo, NewTypeInfo } from '../system/vm/script/info';
import { Script, Constants } from '../system/vm/script';
import { Template } from '../template';
import { Address } from '../address';
import { Message } from '../message';
/**
 * Spawn spawns a single child actor from a template.
 */
export declare class Spawn implements Script {
    template: Template;
    constructor(template: Template);
    name: string;
    constants: Constants;
    immediate: boolean;
    info: (NewTypeInfo | NewForeignFunInfo | NewFunInfo)[];
    code: number[];
}
/**
 * Self provides the address of the current instance.
 */
export declare class Self implements Script {
    constants: Constants;
    name: string;
    immediate: boolean;
    info: never[];
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
    name: string;
    info: NewForeignFunInfo[];
    code: number[];
}
/**
 * Receive schedules a receiver for the actor.
 */
export declare class Receive implements Script {
    f: ForeignFunInfo;
    constructor(f: ForeignFunInfo);
    constants: Constants;
    name: string;
    info: ForeignFunInfo[];
    code: number[];
}
/**
 * Notify attempts to consume the next available message in the mailbox.
 */
export declare class Notify implements Script {
    constants: Constants;
    name: string;
    info: never[];
    code: number[];
}
/**
 * Raise an exception triggering the systems error handling mechanism.
 * TODO: implement
 */
export declare class Raise implements Script {
    msg: string;
    constructor(msg: string);
    name: string;
    constants: Constants;
    info: NewForeignFunInfo[];
    code: number[];
}
/**
 * Kill stops an actor within the executing actor's process tree (inclusive).
 * TODO: implement.
 */
export declare class Kill implements Script {
    addr: string;
    constructor(addr: string);
    name: string;
    constants: Constants;
    info: NewForeignFunInfo[];
    code: number[];
}
