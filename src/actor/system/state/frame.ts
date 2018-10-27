import { Maybe, just } from '@quenk/noni/lib/data/maybe';
import { Mailbox } from '../mailbox';
import { Actor, Behaviour } from '../../';
import { Template } from '../../template';
import { Flags } from './flags';

/**
 * Frames map.
 */
export interface Frames<F extends Frame> {

    [key: string]: F

}

/**
 * Frame stores all the information a system needs about a spawned actor.
 */
export interface Frame {

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
 * ActorFrame is a Frame instance.
 */
export class ActorFrame implements Frame {

    constructor(
        public mailbox: Maybe<Mailbox>,
        public actor: Actor,
        public behaviour: Behaviour[],
        public flags: Flags,
        public template: Template) { }

    /**
     * newFrame constructs a new Frame with default values.
     */
    static create = (actor: Actor, template: Template) =>
        new ActorFrame(
            just([]),
            actor,
            [],
            { immutable: false, buffered: true },
            template);

}