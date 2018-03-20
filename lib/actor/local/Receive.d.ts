import { System, Envelope } from '../../system';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { Receiver } from '.';
/**
 * Receive block for messages.
 */
export declare class Receive<T> {
    fn: Receiver<T>;
    system: System;
    constructor(fn: Receiver<T>, system: System);
    apply(e: Envelope): Maybe<Receive<T>>;
}
