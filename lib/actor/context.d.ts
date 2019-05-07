import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Runtime } from './system/vm/runtime';
import { Template } from './template';
import { Message } from './message';
import { System } from './system';
import { Behaviour, Instance } from './';
/**
 * ErrorHandler processes errors that come up during an actor execution
 * or raised by a child.
 */
export interface ErrorHandler {
    /**
     * raise an error within an actor's context triggering
     * the error handling machinery.
     */
    raise(e: Err): void;
}
/**
 * Flags used to indicate a Frame's state.
 */
export interface Flags {
    [key: string]: boolean;
    /**
     * immutable indicates whether the Frame's current receive
     * should remain after message consumption.
     */
    immutable: boolean;
    /**
     * buffered indicates whether the actor supports mailboxes or not.
     */
    buffered: boolean;
}
/**
 * Contexts map.
 */
export interface Contexts<C extends Context> {
    [key: string]: C;
}
/**
 * Context stores all the information a system needs about a spawned actor.
 */
export interface Context {
    [key: string]: any;
    /**
     * mailbox for the actor.
     *
     * Some actors may not use mailboxes and instead accept messages directly.
     */
    mailbox: Maybe<Message[]>;
    /**
     * actor instance.
     */
    actor: Instance;
    /**
     * behaviour stack for the actor.
     */
    behaviour: Behaviour[];
    /**
     * flags currently enabled for the actor.
     */
    flags: Flags;
    /**
     * runtime for the Context.
     */
    runtime: Runtime;
    /**
     * template used to create new instances of the actor.
     */
    template: Template<System>;
}
