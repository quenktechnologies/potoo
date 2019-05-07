import * as template from '../../../template';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Contexts, Context } from '../../../context';
import { Message } from '../../../message';
import { Address } from '../../../address';
import { Configuration } from '../../configuration';
import { Frame } from '../frame';
import { Value, Script } from '../script';
import { Platform } from '../';
import { System } from '../../';
import { Runtime } from './';
/**
 * This is an implementation of Runtime for exactly one
 * actor.
 *
 * It has all the methods and properties expected for Op code execution.
 */
export declare class This implements Runtime {
    self: Address;
    system: Platform;
    stack: Frame[];
    queue: Frame[];
    constructor(self: Address, system: Platform, stack?: Frame[], queue?: Frame[]);
    running: boolean;
    config(): Configuration;
    current(): Maybe<Frame>;
    allocate(addr: Address, t: template.Template<System>): Context;
    getContext(addr: Address): Maybe<Context>;
    getRouter(addr: Address): Maybe<Context>;
    getGroup(name: string): Maybe<Address[]>;
    getChildren(addr: Address): Maybe<Contexts<Context>>;
    putContext(addr: Address, ctx: Context): This;
    removeContext(addr: Address): This;
    putRoute(target: Address, router: Address): This;
    removeRoute(target: Address): This;
    putMember(group: string, addr: Address): This;
    removeMember(group: string, addr: Address): This;
    push(f: Frame): This;
    clear(): This;
    drop(m: Message): This;
    raise(err: Err): void;
    exec(s: Script): Maybe<Value>;
    run(): Maybe<Value>;
}
