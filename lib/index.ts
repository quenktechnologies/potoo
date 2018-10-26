import * as  log from './actor/system/log';
import { rmerge } from '@quenk/noni/lib/data/record';
import { System, ActorSystem, Configuration } from './actor/system';

/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export const system = (conf: Configuration = {}): System =>
    new ActorSystem([], rmerge({
        log: {
            level: log.WARN,
            logger: console
        }
    }, <any>conf));
