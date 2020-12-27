import { Message } from '../../message';
import { Eff } from '../..';

import { LOG_LEVEL_ERROR, Logger } from './log';
import { Handlers } from './event';

/**
 * Conf values for an actor system.
 */
export interface Conf {

    log: {

        level: number,

        logger: Logger

    },

    on: Handlers,

    /**
     * accept handles messages sent to the root actor, ie the system.
     */
    accept: (m:Message) => Eff

}

/**
 * defaults Conf settings.
 */
export const defaults = (): Conf => ({

    log: {

        level: LOG_LEVEL_ERROR,

        logger: console

    },

    on: {},

  accept: ()=>{}

});
