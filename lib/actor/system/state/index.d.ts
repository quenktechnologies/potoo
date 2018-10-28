import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Actor, Behaviour } from '../../';
import { Template } from '../../template';
import { Envelope } from '../mailbox';
import { Address } from '../../address';
import { Frame, Frames } from './frame';
/**
 * Routes map.
 */
export interface Routes {
    [key: string]: Address;
}
/**
 * State contains Frame entries for all actors in the system.
 */
export declare class State<F extends Frame> {
    frames: Frames<F>;
    routes: Routes;
    constructor(frames: Frames<F>, routes: Routes);
    /**
     * exists tests whether an address exists in the State.
     */
    exists(addr: Address): boolean;
    /**
     * get a Frame using an Address.
     */
    get(addr: Address): Maybe<F>;
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
    getChildFrames(addr: Address): Frames<F>;
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
    put(addr: Address, frame: F): State<F>;
    /**
     * putRoute adds a route to the routing table.
     */
    putRoute(from: Address, to: Address): State<F>;
    /**
     * remove an actor entry.
     */
    remove(addr: Address): State<F>;
    /**
     * runInstance attempts to invoke the run code of an actor instance.
     */
    runInstance(addr: Address): void;
}
