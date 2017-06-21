import { System } from './System';
import { Context } from './Context';
import { Message } from './Message';
/**
 * PendingContext is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export declare class PendingContext extends Context {
    askee: string;
    original: Context;
    resolve: Function;
    system: System;
    constructor(askee: string, original: Context, resolve: Function, system: System);
    feed<M>(m: Message<M>): void;
    start(): void;
}
