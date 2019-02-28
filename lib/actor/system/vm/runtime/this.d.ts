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
import { Runtime } from './';
/**
 * This is an implementation of Runtime for exactly one
 * actor.
 *
 * It has all the methods and properties expected for Op code execution.
 */
export declare class This<C extends Context, S extends Platform<C>> implements Runtime<C, S> {
    self: Address;
    system: S;
    stack: Frame<C, S>[];
    queue: Frame<C, S>[];
    constructor(self: Address, system: S, stack?: Frame<C, S>[], queue?: Frame<C, S>[]);
    running: boolean;
    config(): Configuration;
    current(): Maybe<Frame<C, S>>;
    allocate(addr: Address, t: template.Template<C, S>): C;
    getContext(addr: Address): Maybe<C>;
    getRouter(addr: Address): Maybe<C>;
    getChildren(addr: Address): Maybe<Contexts<C>>;
    putContext(addr: Address, ctx: C): This<C, S>;
    removeContext(addr: Address): This<C, S>;
    putRoute(target: Address, router: Address): This<C, S>;
    removeRoute(target: Address): This<C, S>;
    push(f: Frame<C, S>): This<C, S>;
    clear(): This<C, S>;
    drop(m: Message): This<C, S>;
    raise(err: Err): void;
    exec(s: Script<C, S>): Maybe<Value<C, S>>;
    run(): Maybe<Value<C, S>>;
}