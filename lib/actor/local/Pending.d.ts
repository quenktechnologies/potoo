import { Actor } from '..';
import { System, Envelope } from '../../system';
/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export declare class Pending<R> implements Actor {
    askee: string;
    original: Actor;
    resolve: (r: R) => void;
    system: System;
    constructor(askee: string, original: Actor, resolve: (r: R) => void, system: System);
    accept<M>(e: Envelope<M | R>): Pending<R>;
    run(): Pending<R>;
    terminate(): void;
}
