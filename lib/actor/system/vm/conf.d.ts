import { Logger } from './log';
/**
 * Conf values for an actor system.
 */
export interface Conf {
    log: {
        level: number;
        logger: Logger;
    };
}
/**
 * defaults Conf settings.
 */
export declare const defaults: () => Conf;
