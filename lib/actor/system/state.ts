import {
    Maybe,
    fromString,
    fromNullable,
    fromArray,
    just,
    nothing
} from '@quenk/noni/lib/data/maybe';
import { reduce, contains, partition } from '@quenk/noni/lib/data/record';
import { startsWith } from '@quenk/noni/lib/data/string';
import { Actor, Behaviour } from '../';
import { Template } from '../template';
import { Mailbox, Envelope } from './mailbox';
import { Address, getParent } from '../address';

/**
 * Frames map.
 */
export interface Frames {

    [key: string]: Frame

}

/**
 * Routes map.
 */
export interface Routes {

    [key: string]: Address

}

/**
 * Flags used to indicate a Frame's state.
 */
export interface Flags {

    [key: string]: boolean | undefined

    /**
     * immutable indicates whether the Frame's current receive
     * should remain after message consumption.
     */
    immutable?: boolean,

    /**
     * busy indicates whether the Frame's actor is busy consuming or not.
     */
    busy?: boolean

}

/**
 * Frame stores all information about an actor 
 * needed by the system.
 */
export class Frame {

    constructor(
        public mailbox: Mailbox,
        public actor: Actor,
        public behaviour: Behaviour[],
        public flags: Flags,
        public template: Template) { }

}

/**
 * State contains Frame entries for all actors in the system.
 */
export class State {

    constructor(
        public frames: Frames,
        public routes: Routes) { }

    /**
     * exists tests whether an address exists in the State.
     */
    exists(addr: Address) {

        return contains(this.frames, addr);

    }

    /**
     * get a Frame using an Address.
     */
    get(addr: Address): Maybe<Frame> {

        return fromNullable(this.frames[addr]);

    }

    /**
     * getAddress attempts to retrieve the address of an Actor instance.
     */
    getAddress(actor: Actor): Maybe<Address> {

        return reduce(this.frames, nothing(),
            (p: Maybe<Address>, c, k) => c.actor === actor ?
                fromString(k) : p)

    }

    /**
     * getInstance attempts to retrieve an actor given its address.
     */
    getInstance(addr: Address): Maybe<Actor> {

        return reduce(this.frames, nothing(),
            (p: Maybe<Actor>, c, k) => k === addr ?
                fromNullable(c.actor) : p);

    }

    /**
     * getTemplate attempts to retrieve the template for an
     * actor given an address.
     */
    getTemplate(addr: Address): Maybe<Template> {

        return this.get(addr).map(f => f.template);

    }

    /**
     * getMessage attempts to retrieve the next message
     * from an actors mailbox.
     *
     * If sucessfull, the message will be removed.
     */
    getMessage(addr: Address): Maybe<Envelope> {

        return this
            .get(addr)
            .chain(f => fromArray(f.mailbox))
            .map(m => <Envelope>m.shift());

    }

    /**
     * getBehaviour attempts to retrieve the behaviour for an 
     * actor given an address.
     */
    getBehaviour(addr: Address): Maybe<Behaviour> {

        return this
            .get(addr)
            .chain(f => fromArray(f.behaviour))
            .map(b => b[0]);

    }

    /**
     * getChildFrames returns the child frames for an address.
     */
    getChildFrames(addr: Address): Frames {

        return <Frames>partition(this.frames)((_, key) =>
            (startsWith(getParent(key), addr) && key !== addr))[0];

    }

  /**
   * getRouter will attempt to provide the 
   * routing actor for an Address.
   *
   * The value returned depends on whether the given 
   * address begins with any of the installed router's address.
   */
    getRouter(addr: Address): Maybe<Address> {

        return reduce(this.routes, nothing(), (p, k) =>
            startsWith(addr, k) ? just(k) : p);

    }

    /**
     * put a new Frame in the State.
     */
    put(addr: Address, frame: Frame): State {

        this.frames[addr] = frame;

        return this;

    }

    /**
     * putRoute adds a route to the routing table.
     */
    putRoute(from: Address, to: Address): State {

        this.routes[from] = to;
        return this;

    }

    /**
     * remove an actor entry.
     */
    remove(addr: Address): State {

        delete this.frames[addr];

        return this;

    }

    /**
     * runInstance attempts to invoke the run code of an actor instance.
     */
    runInstance(addr: Address): void {

        this.getInstance(addr).map(a => a.run());

    }

}

/**
 * newFrame constructs a new Frame with default values.
 */
export const newFrame = (actor: Actor, template: Template) =>
    new Frame([], actor, [], { immutable: false, busy: false }, template);
