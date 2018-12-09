import * as config from './actor/system/configuration';
import { State } from './actor/system/state';
import { Envelope } from './actor/mailbox';
import { Context } from './actor/context';
import { Template } from './actor/template';
import { AbstractSystem } from './actor/system';
/**
 * ActorSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export declare class ActorSystem extends AbstractSystem<Context> {
    state: State<Context>;
    running: boolean;
    accept({ to, from, message }: Envelope): ActorSystem;
    allocate(t: Template<Context>): Context;
    /**
     * spawn a new actor from a template.
     */
    spawn(t: Template<Context>): ActorSystem;
}
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export declare const system: (conf: config.Configuration) => ActorSystem;
