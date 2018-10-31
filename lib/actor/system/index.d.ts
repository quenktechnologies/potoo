import * as config from './configuration';
import { Address } from '../address';
import { Template } from '../template';
import { Actor } from '../';
import { Op } from './op';
import { Envelope } from './mailbox';
import { ActorContext } from './state/context';
import { Initializer } from '../';
import { State } from './state';
import { Executor } from './op';
/**
 * System represents a dynamic collection of actors that
 * share the JS event loop.
 */
export interface System extends Actor {
    /**
     * identify an actor instance.
     *
     * If the actor is unknown the ADDRESS_DISCARD should be returned.
     */
    identify(a: Actor): Address;
    /**
     * exec queses up an Op to be executed by the System.
     */
    exec(code: Op): System;
}
/**
 * ActorSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export declare class ActorSystem implements System, Executor<ActorContext> {
    stack: Op[];
    configuration: config.Configuration;
    constructor(stack: Op[], configuration: config.Configuration);
    state: State<ActorContext>;
    running: boolean;
    init(): Initializer;
    exec(code: Op): ActorSystem;
    accept({to, from, message}: Envelope): ActorSystem;
    stop(): void;
    allocate(t: Template): ActorContext;
    spawn(t: Template): ActorSystem;
    identify(actor: Actor): Address;
    run(): void;
}
/**
 * NullSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export declare class NullSystem implements System {
    state: State<ActorContext>;
    configuration: {};
    init(): Initializer;
    accept({to, from, message}: Envelope): NullSystem;
    stop(): void;
    allocate(t: Template): ActorContext;
    spawn(_: Template): NullSystem;
    identify(_: Actor): Address;
    exec(_: Op): NullSystem;
    run(): void;
}
