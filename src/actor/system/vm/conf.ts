import { Err } from '@quenk/noni/lib/control/err';

import { TrapAction } from '../../template';
import { LogSink } from './log';

/**
 * PartialConf allows only some values to be specified in a Conf object
 * instead of all.
 */
export interface PartialConf {
    log?: Partial<Conf['log']>;
    trap?: Conf['trap'];
}

/**
 * Conf objects are used to create and configue various aspects of thhe VM.
 */
export interface Conf {
    /**
     * log configures the logging system.
     */
    log: {
        /**
         * level sets the maximum log level that will be written.
         *
         * Defaults to info.
         */
        level: string;

        /**
         * sink is the destination logs will be written to.
         *
         * Defaults to the console object.
         */
        sink: LogSink;
    };

    /**
     * trap if specified is used as the default trap handler for all actors.
     */
    trap?: (e: Err) => TrapAction;
}
