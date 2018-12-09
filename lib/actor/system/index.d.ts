import * as config from './configuration';
import { Address } from '../address';
import { Template } from '../template';
import { Actor } from '../';
import { Op } from './op';
import { Envelope } from '../mailbox';
import { Context } from '../context';
import { State } from './state';
import { Executor } from './op';
/**
 * System represents a dynamic collection of actors that
 * share the JS event loop.
 */
export interface System<C extends Context> extends Actor<C> {
    /**
     * identify an actor instance.
     *
     * If the actor is unknown the ADDRESS_DISCARD should be returned.
     */
    identify(a: Actor<C>): Address;
    /**
     * exec queses up an Op to be executed by the System.
     */
    exec(code: Op<C>): System<C>;
}
/**
 * AbstractSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export declare abstract class AbstractSystem<C extends Context> implements System<C>, Executor<C> {
    configuration: config.Configuration;
    constructor(configuration?: config.Configuration);
    stack: Op<C>[];
    running: boolean;
    abstract state: State<C>;
    exec(code: Op<C>): AbstractSystem<C>;
    abstract allocate(t: Template<C>): C;
    identify(actor: Actor<Context>): Address;
    init(c: C): C;
    accept({ to, from, message }: Envelope): AbstractSystem<C>;
    stop(): void;
    run(): void;
}
/**
 * NullSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export declare class NullSystem<C extends Context> implements System<C> {
    init(c: C): C;
    accept(_: Envelope): NullSystem<C>;
    stop(): void;
    identify(_: Actor<Context>): Address;
    exec(_: Op<C>): NullSystem<C>;
    run(): void;
}
