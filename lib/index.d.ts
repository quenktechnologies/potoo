import * as config from './actor/system/configuration';
import { ActorSystem } from './actor/system';
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export declare const system: (conf: config.Configuration) => ActorSystem;
