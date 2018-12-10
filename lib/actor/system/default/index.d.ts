/**
 * This module provides a default actor system implementation
 * along with submodules for creating resident actors.
 */
/** imports */
import * as config from '../configuration';
import { State } from '../state';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { Template } from '../../template';
import { AbstractSystem } from '../abstract';
/**
 * ActorSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export declare class ActorSystem extends AbstractSystem<Context> {
    state: State<Context>;
    running: boolean;
    accept({ to, from, message }: Envelope): ActorSystem;
    allocate(t: Template<Context, ActorSystem>): Context;
    /**
     * spawn a new actor from a template.
     */
    spawn(t: Template<Context, ActorSystem>): ActorSystem;
}
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export declare const system: (conf: config.Configuration) => ActorSystem;
