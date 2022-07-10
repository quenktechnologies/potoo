import { Any } from '@quenk/noni/lib/data/type';
import { Address } from '../address';
import { Envelope } from '../mailbox';
export declare const CTRL_MSG_RAISE = 9;
export declare const CTRL_MSG_SEND = 1;
export declare const CTRL_MSG_DROP = 3;
/**
 * RemoteError is a wrapper for errors that occur in remote actors.
 */
export declare class RemoteError {
    error: Error;
    constructor(error: Error);
    type: string;
    message: string;
    stack: string | undefined;
}
/**
 * Raise is used to signal an error has occurred.
 */
export declare class Raise {
    src: Address;
    dest: Address;
    message: string;
    stack: string;
    code: number;
    constructor(src: Address, dest: Address, message?: string, stack?: string);
}
/**
 * Send indicates a interest in sending a message.
 */
export declare class Send extends Envelope {
    code: number;
}
/**
 * Drop indicates a message has been dropped.
 */
export declare class Drop extends Send {
    code: number;
}
/**
 * shapes that can be used to pattern match messages comming from a remote actor.
 */
export declare const shapes: {
    raise: {
        code: number;
        src: StringConstructor;
        dest: StringConstructor;
        message: StringConstructor;
        stack: StringConstructor;
    };
    send: {
        to: StringConstructor;
        from: StringConstructor;
        message: typeof Any;
    };
    drop: {
        code: number;
        from: StringConstructor;
        to: StringConstructor;
        message: typeof Any;
    };
};
