import { noop } from '@quenk/noni/lib/data/function';
import { Type } from '@quenk/noni/lib/data/type';

import { Address } from '../../address';

/**
 * Conf values for an actor system.
 */
export interface Conf {

    /**
     * log is a function that can be supplied to log VM events.
     */
    log: (addr: Address, evt: string, ...args: Type[]) => void

}

/**
 * defaults Conf settings.
 */
export const defaults = (): Conf => ({

    log: noop

});
