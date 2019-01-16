import * as config from '../configuration';
import { Err } from '@quenk/noni/lib/control/error';
import { Address } from '../../address';
import { Template as ActorTemplate } from '../../template';
import { Actor, Instance } from '../../';
import { Op } from '../op';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { State } from '../state';
import { Executor } from '../op';
import { System } from '../';
/**
 * Template is provided here as a convenience when creating new systems.
 *
 * It provides the expected defaults.
 */
export declare class Template {
    id: string;
    create: () => never;
    trap: (e: Err) => never;
}
/**
 * AbstractSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export declare abstract class AbstractSystem<C extends Context> implements System<C>, Executor<C, System<C>> {
    configuration: config.Configuration;
    constructor(configuration?: config.Configuration);
    stack: Op<C, System<C>>[];
    running: boolean;
    abstract state: State<C>;
    abstract allocate(t: ActorTemplate<C, AbstractSystem<C>>): C;
    exec(code: Op<C, AbstractSystem<C>>): AbstractSystem<C>;
    /**
     * spawn a new actor from a template.
     */
    spawn(t: ActorTemplate<C, AbstractSystem<C>>): AbstractSystem<C>;
    identify(actor: Actor<Context>): Address;
    init(c: C): C;
    accept({ to, from, message }: Envelope): AbstractSystem<C>;
    stop(): void;
    run(): void;
}
/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
export declare const newContext: <C extends Context, S extends System<C>>(actor: Instance, template: ActorTemplate<C, S>) => Context;
/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
export declare const newState: <C extends Context>(sys: System<C>) => State<Context>;
