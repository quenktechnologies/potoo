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
import { Actor, Behaviour } from '../../';
import { Template } from '../../template';
import { Envelope } from '../mailbox';
import { Address, getParent } from '../../address';
import { Frame, Frames } from './frame';

/**
 * Routes map.
 */
export interface Routes {

    [key: string]: Address

}

/**
 * State contains Frame entries for all actors in the system.
 */
export class State<F extends Frame> {

    constructor(
        public frames: Frames<F>,
        public routes: Routes) { }

}

/**
 * exists tests whether an address exists in the State.
 */
export const exists = <F extends Frame>(s: State<F>, addr: Address): boolean =>
    contains(s.frames, addr);

/**
 * get a Frame using an Address.
 */
export const get = <F extends Frame>(s: State<F>, addr: Address): Maybe<F> =>
    fromNullable(s.frames[addr]);

/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
export const getAddress =
    <F extends Frame>(s: State<F>, actor: Actor): Maybe<Address> =>
        reduce(s.frames, nothing(),
            (p: Maybe<Address>, c, k) => c.actor === actor ?
                fromString(k) : p);

/**
 * getInstance attempts to retrieve an actor given its address.
 */
export const getInstance =
    <F extends Frame>(s: State<F>, addr: Address): Maybe<Actor> =>
        reduce(s.frames, nothing(),
            (p: Maybe<Actor>, c, k) => k === addr ?
                fromNullable(c.actor) : p);

/**
 * getTemplate attempts to retrieve the template for an
 * actor given an address.
 */
export const getTemplate =
    <F extends Frame>(s: State<F>, addr: Address): Maybe<Template> =>
        get(s, addr).map(f => f.template);

/**
 * getMessage attempts to retrieve the next message
 * from an actors mailbox.
 *
 * If sucessfull, the message will be removed.
 */
export const getMessage =
    <F extends Frame>(s: State<F>, addr: Address): Maybe<Envelope> =>
        get(s, addr)
            .chain(f => f.mailbox)
            .chain(m => fromArray(m))
            .map(m => <Envelope>m.shift());

/**
 * getBehaviour attempts to retrieve the behaviour for an 
 * actor given an address.
 */
export const getBehaviour =
    <F extends Frame>(s: State<F>, addr: Address): Maybe<Behaviour> =>
        get(s, addr)
            .chain(f => fromArray(f.behaviour))
            .map(b => b[0]);

/**
 * getChildFrames returns the child frames for an address.
 */
export const getChildFrames =
    <F extends Frame>(s: State<F>, addr: Address): Frames<F> =>
        <Frames<F>>partition(s.frames)((_, key) =>
            (startsWith(getParent(key), addr) && key !== addr))[0];

/**
 * getParentFrame of an Address.
 */
export const getParentFrame =
    <F extends Frame>(s: State<F>, addr: Address): Maybe<F> =>
        fromNullable(s.frames[getParent(addr)]);

/**
 * getRouter will attempt to provide the 
 * routing actor for an Address.
 *
 * The value returned depends on whether the given 
 * address begins with any of the installed router's address.
 */
export const getRouter =
    <F extends Frame>(s: State<F>, addr: Address): Maybe<Address> =>
        reduce(s.routes, nothing(), (p, k) =>
            startsWith(addr, k) ? just(k) : p);

/**
 * put a new Frame in the State.
 */
export const put =
    <F extends Frame>(s: State<F>, addr: Address, frame: F): State<F> => {

        s.frames[addr] = frame;
        return s;

    }

/**
 * putRoute adds a route to the routing table.
 */
export const putRoute =
    <F extends Frame>(s: State<F>, from: Address, to: Address): State<F> => {

        s.routes[from] = to;
        return s;

    }

/**
 * remove an actor entry.
 */
export const remove =
    <F extends Frame>(s: State<F>, addr: Address): State<F> => {

        delete s.frames[addr];

        return s;

    }

/**
 * runInstance attempts to invoke the run code of an actor instance.
 */
export const runInstance =
    <F extends Frame>(s: State<F>, addr: Address): void => {

        getInstance(s, addr).map(a => a.run());

    }
