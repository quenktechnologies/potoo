import { Address } from '../address';
import { Actor } from '../';
import { Op } from './op';
import { Context } from '../context';
/**
 * System represents a dynamic collection of actors that
 * share the JS event loop.
 */
export interface System<C extends Context> extends Actor<C> {
    /**
     * identify an actor instance.
     *
     * If the actor is unknown the ADDRESS_DISCARD should be returned.
     */
    identify(a: Actor<C>): Address;
    /**
     * exec queses up an Op to be executed by the System.
     */
    exec(code: Op<C, System<C>>): System<C>;
}
