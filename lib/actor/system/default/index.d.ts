/**
 * This module provides a default actor system implementation
 * along with submodules for creating resident actors.
 */
/** imports */
import * as config from '../configuration';
import { State } from '../state';
import { Context } from '../../context';
import { Template as ActorTemplate } from '../../template';
import { AbstractSystem } from '../abstract';
/**
 * ActorSystem
 *
 * Implemenation of a System and Executor that spawns
 * various general purpose actors.
 */
export declare class ActorSystem extends AbstractSystem<Context> {
    running: boolean;
    state: State<Context>;
    allocate(t: ActorTemplate<Context, ActorSystem>): Context;
}
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export declare const system: (conf: config.Configuration) => ActorSystem;
