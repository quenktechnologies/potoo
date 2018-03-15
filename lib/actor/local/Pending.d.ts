import { Actor } from '..';
import { System, Envelope } from '../../system';
/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export declare class Pending<M> implements Actor {
    askee: string;
    original: Actor;
    resolve: (m: M) => void;
    system: System;
    constructor(askee: string, original: Actor, resolve: (m: M) => void, system: System);
    accept(e: Envelope<any>): Pending<M>;
    run(): Pending<M>;
    terminate(): void;
}
