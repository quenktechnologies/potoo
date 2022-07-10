import { Message } from '../../message';
import { Eff } from '../..';

import { LOG_LEVEL_ERROR, LogLevel, LogSink } from './log';
import { Handlers } from './event';

/**
 * Conf represents the configuration of the VM.
 */
export interface Conf {

    /**
     * log_level configures the verbosity of internal logging.
     */
    log_level: LogLevel,

    /**
     * long_sink is the [[LogSink]] that messages will be written to.
     */
    long_sink: LogSink,

    /**
     * on event handlers.
     */
    on: Handlers,

    /**
     * accept handles messages sent to the root actor, ie the system.
     */
    accept: (m: Message) => Eff

}

/**
 * defaults for VM configuration.
 */
export const defaults = (): Conf => ({

    log_level: LOG_LEVEL_ERROR,

    long_sink: console,

    on: {},

    accept: () => { }

});
