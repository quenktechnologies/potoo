import * as config from '../configuration';
import * as template from '../../template';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe'
import { Contexts, Context } from '../../context';
import { Address } from '../../address';
import { State } from '../state';
import { System } from '../';
import { Frame } from './frame';
import { Script } from './script';

/**
 * Environment
 */
export interface Environment<C extends Context, S extends System<C>> {

  /**
   * configuration of the Environment.
   */
  configuration: config.Configuration

    /**
     * state serves as a table of actors within the system.
     */
    state: State<C,S>;

    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<C, S>): C;

}

/**
 * Executor interface.
 *
 * An Executor is responsible for executing the Op codes that allow
 * actors to interact witht the system.
 */
export interface Executor<C extends Context, S extends System<C>> {

    /**
     * current provides the Frame being executed (if any).
     */
    current(): Maybe<Frame<C, S>>

    /**
     * raise is invoked by Op codes to trigger the error
     * handling process when an Error has occured.
     */
    raise(e: Err): void

    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<C, S>): C

    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<C>

    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<C>

    /**
     * getChildren provides the children context's for an address.
     */
    getChildren(addr: Address): Maybe<Contexts<C>>

    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: C): Executor<C, S>

    /**
     * removeContext from the system.
     */
    removeContext(addr: Address): Executor<C, S>

    /**
     * push a new Frame onto the Frame stack, triggering
     * its execution.
     */
    push(f: Frame<C, S>): Executor<C, S>

    /**
     * exec a script on behalf of the actor.
     */
    exec(s: Script<C, S>): void

}
