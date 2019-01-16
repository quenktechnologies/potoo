/**
 * This module provides a default actor system implementation
 * along with submodules for creating resident actors.
 */

/** imports */
import * as config from '../configuration';
import { rmerge } from '@quenk/noni/lib/data/record';
import { State } from '../state';
import { Context } from '../../context';
import { Template as ActorTemplate } from '../../template';
import { AbstractSystem, newContext, newState } from '../abstract';

/**
 * ActorSystem
 *
 * Implemenation of a System and Executor that spawns
 * various general purpose actors.
 */
export class ActorSystem extends AbstractSystem<Context> {

    running: boolean = false;

    state: State<Context> = newState(this);

    allocate(t: ActorTemplate<Context, ActorSystem>): Context {

        let act = t.create(this);
        return act.init(newContext(act, t));

    }

}

/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export const system = (conf: config.Configuration): ActorSystem =>
    new ActorSystem(rmerge(config.defaults(), conf));
