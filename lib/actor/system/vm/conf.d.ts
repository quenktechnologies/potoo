import { Logger } from './log';
import { Handlers } from './event';
/**
 * Conf values for an actor system.
 */
export interface Conf {
    log: {
        level: number;
        logger: Logger;
    };
    on: Handlers;
}
/**
 * defaults Conf settings.
 */
export declare const defaults: () => Conf;
