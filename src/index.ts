import * as config from './actor/system/configuration';
import { rmerge } from '@quenk/noni/lib/data/record';
import { ActorSystem } from './actor/system';

/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export const system = (conf: config.Configuration): ActorSystem =>
    new ActorSystem([], rmerge(conf, config.defaults()));
