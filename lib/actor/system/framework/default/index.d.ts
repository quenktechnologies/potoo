/**
 * This module provides a default actor system implementation
 * along with submodules for creating resident actors.
 */
/** imports */
import * as config from '../../configuration';
import { State } from '../../state';
import { Context } from '../../../context';
import { Template } from '../../../template';
import { Runtime } from '../../vm/runtime';
import { Actor } from '../../../';
import { AbstractSystem } from '../../framework';
/**
 * ActorSystem default implementation for general purpose work.
 */
export declare class ActorSystem extends AbstractSystem<Context> {
    state: State<Context>;
    allocate(a: Actor<Context>, h: Runtime, t: Template<Context, ActorSystem>): Context;
}
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export declare const system: (conf: config.Configuration) => ActorSystem;
