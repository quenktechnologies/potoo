import { Err } from '@quenk/noni/lib/control/err';

import { Address } from '../../../address';
import { Actor } from '../../..';
import { Template } from 'actor/template';

export const ERR_THREAD_INVALID = 'ERR_THREAD_INVALID';

/**
 * Thread serves as the execution context for a single actor.
 *
 * Coincidentally, Threads are themselves actors as far as the system is
 * concerned. This design allows any external code to simply allocate a Thread
 * and use it to communicate with the system without having to extend internal
 * classes or re-implement existing logic.
 *
 * Threads are of course, not actual OS threads but rather an abstract of the
 * VM used to make managing actors easier.
 */
export interface Thread extends Actor {
    /**
     * template used to configure the Thread.
     */
    template: Template;

    /**
     * address for the Thread (actor) within the system.
     */
    address: Address;

    /**
     * raise an error triggering the system's error handling machinery.
     */
    raise(e: Err): Promise<void>;
}
