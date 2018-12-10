import * as config from './configuration';
import { Address } from '../address';
import { Template } from '../template';
import { Actor } from '../';
import { Op } from './op';
import { Envelope } from '../mailbox';
import { Context } from '../context';
import { State } from './state';
import { Executor } from './op';
import { System } from './';
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
    exec(code: Op<C, AbstractSystem<C>>): AbstractSystem<C>;
    abstract allocate(t: Template<C, AbstractSystem<C>>): C;
    identify(actor: Actor<Context>): Address;
    init(c: C): C;
    accept({ to, from, message }: Envelope): AbstractSystem<C>;
    stop(): void;
    run(): void;
}
