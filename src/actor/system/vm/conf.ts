import { LOG_LEVEL_ERROR, Logger } from './log';

/**
 * Conf values for an actor system.
 */
export interface Conf {

    log: {

        level: number,

        logger: Logger

    }

}

/**
 * defaults Conf settings.
 */
export const defaults = (): Conf => ({

    log: {

        level: LOG_LEVEL_ERROR,

        logger: console

    }

});
