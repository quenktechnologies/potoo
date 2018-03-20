import * as Promise from 'bluebird';
import { System, Envelope } from '../../system';
import { Cases, LocalActor } from '.';
import { Template, Address, Result } from '..';
/**
 * Resident provides a LocalActor impleemntation.
 */
export declare abstract class Resident implements LocalActor {
    system: System;
    abstract accept(m: Envelope): Result;
    self: () => string;
    constructor(system: System);
    spawn(t: Template): Address;
    tell<M>(ref: string, m: M): Resident;
    ask<M, R>(ref: string, m: M, time?: number): Promise<R>;
    select<T>(_: Cases<T>): Resident;
    run(_: Address): void;
    kill(addr: Address): Resident;
    exit(): void;
    terminate(): void;
}
