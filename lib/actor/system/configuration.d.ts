import * as log from './log';
import * as hooks from './hooks';
/**
 * Configuration values for an actor system.
 */
export interface Configuration {
    [key: string]: any;
    /**
     * log settings
     */
    log?: LogPolicy;
    /**
     * hooks defined by the user.
     */
    hooks?: hooks.Hooks;
}
/**
 * LogPolicy for the system.
 */
export interface LogPolicy {
    /**
     * level of the events to be logged.
     */
    level?: number;
    /**
     * logger is the actual logging implemention.
     *
     * It MUST correspond to the basic info,warn and error api of the javascript console.
     */
    logger?: log.Logger;
}
export declare const defaults: () => {
    log: {
        level: number;
        logger: Console;
    };
};
