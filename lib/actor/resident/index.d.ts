import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../system/vm/runtime/context';
import { System } from '../system';
import { Address, AddressMap } from '../address';
import { Message } from '../message';
import { Templates, Spawnable } from '../template';
import { Actor, Eff } from '../';
import { Api } from './api';
import { Data } from '../system/vm/runtime/stack/frame';
/**
 * Reference to an actor address.
 */
export declare type Reference = (m: Message) => void;
/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident extends Api, Actor {
}
/**
 * AbstractResident is a base implementation of a Resident actor.
 */
export declare abstract class AbstractResident implements Resident {
    system: System;
    constructor(system: System);
    self: () => string;
    get platform(): import("../system/vm").Platform;
    abstract init(c: Context): Context;
    notify(): void;
    accept(_: Message): void;
    spawn(t: Spawnable): Address;
    spawnGroup(group: string | string[], tmpls: Templates): AddressMap;
    tell<M>(ref: Address, msg: M): AbstractResident;
    raise(e: Err): AbstractResident;
    kill(addr: Address): AbstractResident;
    exit(): void;
    start(addr: Address): Eff;
    run(): void;
    stop(): void;
    /**
     * exec calls a VM function by name on behalf of this actor.
     */
    exec(fname: string, args: Data[]): void;
}
/**
 * ref produces a function for sending messages to an actor address.
 */
export declare const ref: (res: Resident, addr: Address) => Reference;
