import * as config from '../configuration';
import { Err } from '@quenk/noni/lib/control/error';
import { Template as ActorTemplate } from '../../template';
import { Actor, Instance } from '../../';
import { Context } from '../../context';
import { Template } from '../../template';
import { State } from '../state';
import { Runtime } from '../vm/runtime';
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
 * AbstractSystem
 *
 * Implemnation of a System and Runtime that spawns
 * various general purpose actors.
 */
export declare abstract class AbstractSystem<C extends Context> implements System<C> {
    configuration: config.Configuration;
    constructor(configuration?: config.Configuration);
    abstract state: State<C>;
    abstract allocate(a: Actor<C>, h: Runtime<C, AbstractSystem<C>>, t: Template<C, AbstractSystem<C>>): C;
    /**
     * spawn a new actor from a template.
     */
    spawn(t: ActorTemplate<C, AbstractSystem<C>>): AbstractSystem<C>;
    init(c: C): C;
    notify(): void;
    accept(): this;
    stop(): void;
    run(): void;
}
/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
export declare const newContext: <C extends Context, S extends System<C>>(actor: Instance, handler: Runtime<C, S>, template: ActorTemplate<C, S>) => Context;
/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
export declare const newState: <C extends Context>(sys: System<C>) => State<Context>;
