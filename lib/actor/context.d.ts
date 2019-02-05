import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Template } from './template';
import { Message } from './message';
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
     * handler for errors.
     */
    handler: ErrorHandler;
    /**
     * template used to create new instances of the actor.
     *
     * XXX: We use the any type here because this is
     * a cyclical constraint. In the future we may refactor to find a
     * way around this but for now it keeps things going.
     */
    template: Template<any, any>;
}
