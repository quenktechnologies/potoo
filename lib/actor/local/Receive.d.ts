import { System, Envelope } from '../../system';
import { ConsumeResult, Case } from '.';
/**
 * Receive block for messages.
 */
export declare class Receive<T> {
    cases: Case<T>[];
    system: System;
    constructor(cases: Case<T>[], system: System);
    consume(e: Envelope): ConsumeResult;
}
