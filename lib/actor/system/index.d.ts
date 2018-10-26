import * as log from './log';
import * as hooks from './hooks';
import { Actor } from '../';
import { Template } from '../template';
import { Op } from './op';
import { Envelope } from './mailbox';
import { State } from './state';
/**
 * System represents a dynamic collection of actors that
 * share the JS event loop.
 */
export interface System extends Actor {
    /**
     * configuration
     */
    configuration: Configuration;
    /**
     * actors table.
     */
    actors: State;
    /**
     * spawn a new root level child actor.
     */
    spawn(t: Template): System;
    /**
     * exec queses up an Op to be executed by the System.
     */
    exec(code: Op): System;
}
/**
 * Configuration values for an actor system.
 */
export interface Configuration {
    /**
     * log settings
     */
    log?: log.LogPolicy;
    /**
     * hooks defined by the user.
     */
    hooks?: hooks.Hooks;
}
/**
 * ActorSystem
 * @private
 */
export declare class ActorSystem implements System {
    stack: Op[];
    configuration: Configuration;
    constructor(stack: Op[], configuration: Configuration);
    actors: State;
    running: boolean;
    exec(code: Op): System;
    accept({to, from, message}: Envelope): System;
    stop(): void;
    /**
     * logOp
     *
     * @private
     */
    logOp(o: Op): Op;
    spawn(t: Template): System;
    run(): void;
}
/**
 * NullSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export declare class NullSystem implements System {
    actors: State;
    configuration: {};
    exec(_: Op): System;
    accept({to, from, message}: Envelope): System;
    stop(): void;
    spawn(_: Template): System;
    run(): void;
}
