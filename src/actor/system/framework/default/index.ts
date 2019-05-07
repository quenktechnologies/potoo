/**
 * This module provides a default actor system implementation
 * along with submodules for creating resident actors.
 */

/** imports */
import * as config from '../../configuration';
import { rmerge } from '@quenk/noni/lib/data/record';
import { State } from '../../state';
import { Context } from '../../../context';
import { Template } from '../../../template';
import { Runtime } from '../../vm/runtime';
import { Actor } from '../../../';
import { AbstractSystem, newContext, newState } from '../../framework';

/**
 * ActorSystem default implementation for general purpose work.
 */
export class ActorSystem extends AbstractSystem<Context> {

    state: State<Context> = newState(this);

    allocate(
        a: Actor<Context>,
        h: Runtime,
        t: Template<Context, ActorSystem>): Context {

        return newContext(a, <Runtime>h, t);

    }

}

/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export const system = (conf: config.Configuration): ActorSystem =>
    new ActorSystem(rmerge(config.defaults(), conf));
