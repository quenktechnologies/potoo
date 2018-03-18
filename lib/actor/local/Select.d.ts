import { System, Envelope } from '../../system';
import { ConsumeResult, Case } from '.';
/**
 * Select is for selective receives.
 */
export declare class Select<T> {
    cases: Case<T>[];
    system: System;
    constructor(cases: Case<T>[], system: System);
    consume(m: Envelope): ConsumeResult;
}
