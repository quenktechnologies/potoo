import { Maybe, just } from '@quenk/noni/lib/data/maybe';
import { Mailbox } from '../mailbox';
import { Actor, Behaviour } from '../../';
import { Template } from '../../template';
import { Flags } from './flags';

/**
 * Contexts map.
 */
export interface Contexts<F extends Context> {

    [key: string]: F

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
    mailbox: Maybe<Mailbox>,

    /**
     * actor instance.
     */
    actor: Actor,

    /**
     * behaviour stack for the actor.
     */
    behaviour: Behaviour[],

    /**
     * flags currently enabled for the actor.
     */
    flags: Flags,

    /**
     * template used to create new instances of the actor.
     */
    template: Template

}

/**
 * ActorContext is a Context instance.
 */
export class ActorContext implements Context {

    constructor(
        public mailbox: Maybe<Mailbox>,
        public actor: Actor,
        public behaviour: Behaviour[],
        public flags: Flags,
        public template: Template) { }

    /**
     * create constructs a new Context with default values.
     */
    static create = (actor: Actor, template: Template) =>
        new ActorContext(
            just([]),
            actor,
            [],
            { immutable: false, buffered: true },
            template);

}
