import * as Promise from 'bluebird';
import { System, Envelope } from '../../system';
import { LocalActor } from '.';
import { Template, Address } from '..';
/**
 * Resident provides a LocalActor impleemntation.
 */
export declare abstract class Resident implements LocalActor {
    system: System;
    abstract run(path: Address): Resident;
    abstract accept<M>(m: Envelope<M>): Resident;
    self: () => string;
    constructor(system: System);
    spawn(t: Template): Address;
    tell<M>(ref: string, m: M): Resident;
    ask<M, R>(ref: string, m: M, time?: number): Promise<R>;
    kill(addr: Address): Resident;
    exit(): void;
    terminate(): void;
}
