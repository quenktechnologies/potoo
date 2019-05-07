import { Context } from '../../context';
import { Template } from '../../template';
import { Actor } from '../../';
import { Configuration } from '../configuration';
import { State } from '../state';
import { System } from '../';
import { Runtime } from './runtime';

/**
 * Platform contains a dynamic collection of actors that 
 * share the a JS runtime.
 *
 * A Platform implementor is used by other APIs in this module 
 * to execute scripts on behalf of actors.
 */
export interface Platform extends System<Context>, Actor<Context> {

    /**
     * configuration of the Platform.
     */
    configuration: Configuration

    /**
     * state table.
     */
    state: State<Context>;

    /**
     * allocate a new Context for an actor.
     */
    allocate(a: Actor<Context>, h: Runtime, t: Template<Context, this>): Context;

}
