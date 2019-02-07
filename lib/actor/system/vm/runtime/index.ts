import * as template from '../../../template';
import { Maybe } from '@quenk/noni/lib/data/maybe'
import { Contexts, Context, ErrorHandler } from '../../../context';
import { Address } from '../../../address';
import { Message } from '../../../message';
import { Configuration } from '../../configuration';
import { Frame } from '../frame';
import { Value, Script } from '../script';
import { System } from '../../';

/**
 * Runtime interface.
 *
 * An Runtime is responsible for executing the Op codes that allow
 * actors to interact with the rest of the system.
 */
export interface Runtime<C extends Context, S extends System<C>>
    extends ErrorHandler {

    /**
     * self is the address of the actor.
     */
    self: Address

    /**
     * config provides the system configuration.
     */
    config(): Configuration

    /**
     * exec a Script on behalf of the actor.
     */
      exec(s: Script<C, S>): Maybe<Value<C,S>>

    /**
     * current provides the Frame being executed (if any).
     */
    current(): Maybe<Frame<C, S>>

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
    putContext(addr: Address, ctx: C): Runtime<C, S>

    /**
     * removeContext from the system.
     */
    removeContext(addr: Address): Runtime<C, S>

    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Runtime<C, S>

    /**
     * removeRoute configuration.
     */
    removeRoute(target: Address): Runtime<C, S>

    /**
     * push a new Frame onto the stack, triggering
     * its execution.
     */
    push(f: Frame<C, S>): Runtime<C, S>

    /**
     * clear all Frames from the stack, thus ending
     * current execution.
     */
    clear(): Runtime<C, S>

    /**
     * drop a Message
     */
    drop(m: Message): Runtime<C, S>

}
