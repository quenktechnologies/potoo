import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe'
import { Context } from '../../context';
import { Template } from '../../template';
import { Address } from '../../address';
import { System } from '../';
import { Frame } from './frame';

/**
 * Executor interface.
 *
 * An Executor is responsible for executing the Op codes that allow
 * actors to interact witht the system.
 */
export interface Executor<C extends Context, S extends System<C>> {

    /**
     * current is the current Frame being executed.
     */
    current: Frame<C, S>

    /**
     * stack 
     */
    stack: Frame<C, S>[]

    /**
     * raise is invoked by Op codes to trigger the error
     * handling process when an Error has occured.
     */
    raise(e: Err): void

    /**
     * allocate a new Context for an actor.
     */
    allocate(t: Template<C, S>): C

    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<C>

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

}
