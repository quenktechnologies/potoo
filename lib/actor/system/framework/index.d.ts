import * as config from '../configuration';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Value, Script } from '../vm/script';
import { Runtime } from '../vm/runtime';
import { Platform } from '../vm';
import { Address } from '../../address';
import { Template as ActorTemplate } from '../../template';
import { Context } from '../../context';
import { Template } from '../../template';
import { Message } from '../../message';
import { State } from '../state';
import { Actor, Instance } from '../../';
import { System } from '../';
/**
 * STemplate is provided here as a convenience when creating new systems.
 *
 * It provides the expected defaults.
 */
export declare class STemplate {
    id: string;
    create: () => never;
    trap: (e: Err) => never;
}
/**
 * AbstractSystem can be extended to create a customized actor system.
 */
export declare abstract class AbstractSystem<C extends Context> implements System, Platform {
    configuration: config.Configuration;
    constructor(configuration?: config.Configuration);
    abstract state: State<C>;
    abstract allocate(a: Actor<C>, h: Runtime, t: Template<C, AbstractSystem<C>>): Context;
    ident(i: Instance): Address;
    /**
     * spawn a new actor from a template.
     */
    spawn(t: ActorTemplate<C, AbstractSystem<C>>): AbstractSystem<C>;
    init(c: C): C;
    notify(): void;
    accept(_: Message): void;
    stop(): void;
    run(): void;
    exec(i: Instance, s: Script): Maybe<Value>;
}
/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
export declare const newContext: <C extends Context, S extends System>(actor: Instance, runtime: Runtime, template: ActorTemplate<C, S>) => Context;
/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
export declare const newState: (sys: Platform) => State<Context>;
