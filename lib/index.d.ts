import { System, Configuration } from './actor/system';
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export declare const system: (conf?: Configuration) => System;
