import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Mailbox } from './mailbox';
import { Behaviour, Instance } from './';
import { Template } from './template';
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
    mailbox: Maybe<Mailbox>;
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
     * template used to create new instances of the actor.
     *
     * XXX: We use the any type here because the this effectively
     * a cyclical constraint. In the future we may refactor to find a
     * way around this.
     */
    template: Template<any>;
}
