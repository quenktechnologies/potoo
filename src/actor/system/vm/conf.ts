import { LogSink } from './log';

/**
 * PartialConfig allows only some values to be specified in a Config object
 * instead of all.
 */
export interface PartialConfig {
    log?: Partial<Config['log']>;
}

/**
 * Config objects are used to create and configue various aspects of thhe VM.
 */
export interface Config {
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
}
