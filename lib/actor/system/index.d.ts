import { Context } from '../context';
import { Template } from '../template';
import { Actor } from '../';
import { Configuration } from './configuration';
import { State } from './state';
import { Runtime } from './vm/runtime';
/**
 * System represents a dynamic collection of actors that
 * share the JS event loop.
 *
 * A System has a configuration that is used to make decisions
 * during actor execution, a state containing a context for each
 * actor and a method for creating new contexts.
 */
export interface System<C extends Context> extends Actor<C> {
    /**
     * configuration of the System.
     */
    configuration: Configuration;
    /**
     * state table.
     */
    state: State<C>;
    /**
     * allocate a new Context for an actor.
     */
    allocate(a: Actor<C>, h: Runtime<C, System<C>>, t: Template<C, System<C>>): C;
}
