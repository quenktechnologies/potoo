import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Actor, Behaviour } from '../';
import { Template } from '../template';
import { Mailbox, Envelope } from './mailbox';
import { Address } from '../address';
/**
 * Frames map.
 */
export interface Frames {
    [key: string]: Frame;
}
/**
 * Routes map.
 */
export interface Routes {
    [key: string]: Address;
}
/**
 * Flags used to indicate a Frame's state.
 */
export interface Flags {
    [key: string]: boolean | undefined;
    /**
     * immutable indicates whether the Frame's current receive
     * should remain after message consumption.
     */
    immutable?: boolean;
    /**
     * busy indicates whether the Frame's actor is busy consuming or not.
     */
    busy?: boolean;
}
/**
 * Frame stores all information about an actor
 * needed by the system.
 */
export declare class Frame {
    mailbox: Mailbox;
    actor: Actor;
    behaviour: Behaviour[];
    flags: Flags;
    template: Template;
    constructor(mailbox: Mailbox, actor: Actor, behaviour: Behaviour[], flags: Flags, template: Template);
}
/**
 * State contains Frame entries for all actors in the system.
 */
export declare class State {
    frames: Frames;
    routes: Routes;
    constructor(frames: Frames, routes: Routes);
    /**
     * exists tests whether an address exists in the State.
     */
    exists(addr: Address): boolean;
    /**
     * get a Frame using an Address.
     */
    get(addr: Address): Maybe<Frame>;
    /**
     * getAddress attempts to retrieve the address of an Actor instance.
     */
    getAddress(actor: Actor): Maybe<Address>;
    /**
     * getInstance attempts to retrieve an actor given its address.
     */
    getInstance(addr: Address): Maybe<Actor>;
    /**
     * getTemplate attempts to retrieve the template for an
     * actor given an address.
     */
    getTemplate(addr: Address): Maybe<Template>;
    /**
     * getMessage attempts to retrieve the next message
     * from an actors mailbox.
     *
     * If sucessfull, the message will be removed.
     */
    getMessage(addr: Address): Maybe<Envelope>;
    /**
     * getBehaviour attempts to retrieve the behaviour for an
     * actor given an address.
     */
    getBehaviour(addr: Address): Maybe<Behaviour>;
    /**
     * getChildFrames returns the child frames for an address.
     */
    getChildFrames(addr: Address): Frames;
    /**
     * getRouter will attempt to provide the
     * routing actor for an Address.
     *
     * The value returned depends on whether the given
     * address begins with any of the installed router's address.
     */
    getRouter(addr: Address): Maybe<Address>;
    /**
     * put a new Frame in the State.
     */
    put(addr: Address, frame: Frame): State;
    /**
     * putRoute adds a route to the routing table.
     */
    putRoute(from: Address, to: Address): State;
    /**
     * remove an actor entry.
     */
    remove(addr: Address): State;
    /**
     * runInstance attempts to invoke the run code of an actor instance.
     */
    runInstance(addr: Address): void;
}
/**
 * newFrame constructs a new Frame with default values.
 */
export declare const newFrame: (actor: Actor, template: Template) => Frame;
