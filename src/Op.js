import { v4 } from 'uuid';
import { merge } from './util';
import { type, any, call, or } from './be';
import { Free } from './monad';
import { Type } from './Type';
import { Actor, ActorT, MVar } from './Actor';

/**
 * @module Ops
 *
 * Provides classes that represent instructions the system must carry out
 * and constructor functions.
 */

/**
 * Op is the base class of all instruction classes.
 * @abstract
 */
export class Op extends Type {

    constructor(props, checks) {

        super(props, merge({ next: any }, checks));

    }

    map(f) {

        return this.copy({ next: f(this.next) });

    }

}

/**
 * Spawn a new child actor.
 */
export class Spawn extends Op {

    constructor(props) {

        super(props, {
            id: or(type(String), call(v4)),
            template: type(ActorT),
            next: any
        });

    }
}

/**
 * Send a message to an actor.
 * @property {to} string
 * @property {*} message
 */
export class Send extends Op {

    constructor(props) {

        super(props, {
            id: or(type(String), call(v4)),
            to: type(String),
            message: any
        });

    }
}

/**
 * Stop the system or an actor.
 * @property {string}
 */
export class Stop extends Op {

    constructor(props) {

        super(props, {

            path: type(String),
            next: any

        });

    }

}

/**
 * Receive represents a request to receive the earliest message
 */
export class Receive extends Op {

    constructor(props) {

        super(props, {

            id: or(type(String), call(v4)),
            behaviour: type(Function),
            next: any

        });

    }

}

/**
 * Replace
 * @private
 */
export class Replace extends Op {

    constructor(props) {

        super(props, {

            id: call(v4),
            actor: type(Actor),

        });

    }

}

/**
 * IOOP
 * @property {function} io
 */
export class IOOP extends Op {

    constructor(props) {

        super(props, { f: type(Function) });

    }

}

/**
 * NOOP
 * @private
 */
export class NOOP extends Op {}

/**
 * Drop represents a request to drop a message.
 * @property {to} string
 * @property {string} from
 * @property {*} message
 */
export class Drop extends Op {

    constructor(props) {

        super(props, {

            to: type(String),
            from: type(String),
            message: any

        });

    }

}

/**
 * spawn creates a new spawn request
 * @param {ActorT} template
 * @return {Free}
 * @summary {ActorT →  Free<Functor, Spawn>}
 */
export const spawn = template => new Spawn({ template });

/**
 * spawnF
 * @summary {ActorT →  Free<F,O>}
 */
export const spawnF = t => Free.liftF(spawn(t));

/**
 * send creates a Send
 * @summary {(string, string,  *) →  Free<Send, null> }
 */
export const send = (to, message) => new Send({ to, message });

/**
 * sendF
 * @summary {(string, string,  *) →  Free<F,O>}
 */
export const sendF = (t, m) => Free.liftF(send(t, m));

/**
 * stop creates a new Stop request.
 * @param {string} path
 */
export const stop = path => new Stop({ path });

/**
 * stopF
 * @summary {string →  Free<F,O>
 */
export const stopF = p => Free.liftF(stop(p));

/**
 * receive creates a new receive request.
 * @param {function} behaviour
 * @summary { (* →  Free<Functor, Op>) →  Receive }
 */
export const receive = behaviour => new Receive({ behaviour });

/**
 * receiveF
 * @summary {Behaviour →  Free<F,O>}
 */
export const receiveF = b => Free.liftF(receive(b));

/**
 * replace
 * @summary {Actor →  Replace}
 */
export const replace = actor => new Replace({ actor });

/**
 * replaceF
 * @summary {Actor →  Free<Replace, null>}
 */
export const replaceF = a => Free.liftF(replace(a));

/**
 * drop
 * @param {string} to
 * @param {*} message
 * @summary {(string, string, *) →  Drop}
 */
export const drop = (to, from, message) => new Drop({ to, from, message });

/**
 * dropF
 * @summary {(string, *) →  Free<F,O>}
 */
export const dropF = (t, m) => Free.liftF(drop(t, m));

/**
 * ioop
 * @param {function} f
 * @summary {(System →  IO<System>) →  IOOP
 */
export const ioop = f => new IOOP({ f });

/**
 * ioopF
 * @param {function} f
 * @summary {(System →  IO<System>) →  Free<F,O>}
 */
export const ioopF = f => Free.liftF(ioop(f));

const _noop = new NOOP();

/**
 * noop
 * @private
 */
export const noop = () => _noop;

/**
 * noopF
 * @summary {() →  Free<F,O>
 */
export const noopF = () => Free.liftF(noop());
