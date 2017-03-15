import { v4 } from 'uuid';
import { merge, partial, compose } from './util';
import { type, any, call, or } from './be';
import { liftF, Maybe, IO } from './monad';
import { Type } from './Type';
import { match } from './Match';
import { makeMVar } from './MVar';
import { Actor, LocalT, FutureT, ActorL, ActorFT, DuplicateActorIdError, get as childGet } from './Actor';

const next = x => x;

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
        this.map = map(this);

    }

}

/**
 * Getter
 */
export class Getter extends Op {}

/**
 * System
 */
export class System extends Getter {}

/**
 * Self
 */
export class Self extends Getter {}

/**
 * Get
 */
export class Get extends Getter {

    constructor(props) {

        super(props, { id: type(String) });

    }

}

/**
 * Raise
 */
export class Raise extends Op {

    constructor(props) {

        super(props, { error: type(Error) });

    }

}

/**
 * Put
 */
export class Put extends Op {

    constructor(props) {

        super(props, { actor: type(Actor) });

    }

}

/**
 * Select
 */
export class Select extends Getter {

    constructor(props) {

        super(props, { path: type(String) });

    }

}

/**
 * Accept
 */
export class Accept extends Op {

    constructor(props) {

        super(props, { message: any, actor: type(Actor) });

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
 * Replace
 * @private
 */
export class Replace extends Op {

    constructor(props) {

        super(props, {

            actor: type(Actor)

        });

    }

}

/**
 * Update
 */
export class Update extends Op {

    constructor(props) {

        super(props, { actor: type(Actor) });

    }

}

/**
 * Output
 */
export class Output extends Op {

    constructor(props) {

        super(props, { iof: type(Function) });

    }

}

/**
 * Input
 */
export class Input extends Getter {

    constructor(props) {

        super(props, { iof: type(Function) });

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
 * map over an Op
 * @summary {Op<A> →  (A→ B) Op<B>}
 */
export const map = op => f => match(op)
    .caseOf(System, ({ next }) => new System({ next: compose(f, next) }))
    .caseOf(Self, ({ next }) => new Self({ next: compose(f, next) }))
    .caseOf(Get, ({ id, next }) => new Get({ id, next: compose(f, next) }))
    .caseOf(Raise, next)
    .caseOf(Put, ({ actor, next }) => new Put({ actor, next: compose(f, next) }))
    .caseOf(Select, ({ path, next }) => new Select({ path, next: compose(f, next) }))
    .caseOf(Accept, ({ message, actor, next }) => new Accept({ message, actor, next: compose(f, next) }))
    .caseOf(Replace, ({ actor, next }) => new Replace({ actor, next: f(next) }))
    .caseOf(Update, ({ actor, next }) => new Update({ actor, next: f(next) }))
    .caseOf(Output, ({ iof, next }) => new Output({ iof, next: f(next) }))
    .caseOf(Input, ({ iof, next }) => new Input({ iof, next: compose(f, next) }))
    .end();

/**
 * sspawn a child actor on the System
 * @summary sspawn :: ActorT →  Free<F,V>
 */
export const sspawn = t => system().chain(s => make(s, t, replace));

/**
 * system provides the system
 * @summary system :: () →  Free<System,null>
 */
export const system = () => liftF(new System({ next }));

/**
 * spawn creates a new spawn request
 * @param {ActorT} template
 * @return {Free}
 * @summary {ActorT →  Free<Raise|Update, null>}
 */
export const spawn = t => self().chain(a => make(a, t, update));

/**
 * make a child actor
 * @summary sspawn :: (Actor, ActorT, Actor →  Free<F,V>) →  Free<F,V>
 */
export const make = (parent, template, after) =>
    Maybe
    .not(childGet(template.id, parent))
    .map(() => raise(new DuplicateActorIdError(parent.path, template.id)))
    .orJust(create(parent.path, template).chain(after))
    .extract();

/**
 * self gets the actor for the current context.
 * @summary {self :: null →  Free<F, ActorL>
 */
export const self = () => liftF(new Self({ next }));

/**
 * get returns a child actor based on id if it exists
 * @summary {(string) →  Free<Get, Actor|null>
 */
export const get = id => liftF(new Get({ id, next }));

/**
 * put a new child actor into the list of children
 * @summary Actor →  Free<F,null>
 */
export const put = actor => liftF(new Put({ actor, next }));

/**
 * raise an error within the system.
 * This function gives the supervisor (if any) a chance to
 * intercept and react to the error. It also terminates
 * the current chain of instructions.
 * @summary raise :: Error →  Free<null,Error>
 */
export const raise = error => liftF(new Raise({ error }));

/**
 * create an actor, that's it does not add it to the system or
 * anything else.
 * @summary create :: (string, ActorT)  →  Free<Op,Actor>
 */
export const create = (parent, template) => match(template)
    .caseOf(LocalT, ({ id, start }) => put(new ActorL({
        id,
        parent,
        path: _address(parent, id),
        ops: start(),
        template
    })))
    .caseOf(FutureT, ({ id, mvar }) => put(new ActorFT({
        id,
        parent,
        path: _address(parent, id),
        ops: receive(next),
        mvar,
        template
    })))
    .end();

const _address = (parent, id) => ((parent === '') || (parent === '/')) ? id : `${parent}/${id}`;

/**
 * tell another actor a message
 * @summary tell :: (string,*) →  Free<F, Actor>
 */
export const tell = (to, message) =>
    self()
    .chain(a => select(to)
        .chain(partial(accept, message))
        .chain(a.path === to ? update : replace));

/**
 * select an actor based on an address
 * @summary select :: string →  Free<F,Actor>
 */
export const select = path => liftF(new Select({ path, next }));

/**
 * accept a message
 * @summary accept :: (*, Actor) →  Free<F,Actor>
 */
export const accept = (message, actor) => liftF(new Accept({ message, actor, next }));

/**
 * replace an actor with the latest version
 * @summary replace :: Actor →  Free<F,null>
 */
export const replace = actor => liftF(new Replace({ actor }));

/**
 * update the current actor to the latest version
 * @summary update :: Actor →  Free<F,null>
 */
export const update = actor => liftF(new Update({ actor }));

/**
 * receive the next message with the specified behaviour
 * @summary receive :: (* →  Free<F,*>) →  Free<null,null>
 */
export const receive = behaviour =>
    self()
    .chain(a => match(a)
        .caseOf(ActorFT, ({ mvar }) =>
            input(() => mvar.take())
            .chain(v => v !== null ? behaviour(v) : update(a.copy({ ops: receive(behaviour) }))))
        .caseOf(ActorL, a => update(a.copy({
            ops: Maybe
                .not(a.mailbox[0])
                .map(behaviour)
                .orElse(() => receive(behaviour))
                .extract()
        }))).end());

/**
 * future spawns a temporary child actor that listens waits
 * on the result of a user supplied Future.
 * @param {Future} ft
 * @return {Free<SpawnIO,null>}
 * @summary {  (null →  Future) →  Free<Spawn, null> }
 */
export const future = f =>
    self()
    .chain(a =>
        input(() =>
            makeMVar()
            .chain(mvar => IO.of({
                abort: f().fork(error => mvar.put(raise(error)), m => mvar.put(tell(a.path, m))),
                mvar
            })))
        .chain(({ abort, mvar }) => spawn(new FutureT({ mvar, abort }))));

/**
 * input is used for executing side effects and getting the result.
 * @summary input :: (null →  IO<*>)→  Free<Input, null>
 */
export const input = iof => liftF(new Input({ iof, next }));

/**
 * output is used for executing side effects when we don't care about the result
 * @summary output :: (* →  IO<null>) →  Free<Output, null>
 */
export const output = iof => liftF(new Output({ iof }));

/**
 * stop creates a new Stop request.
 * @param {string} path
 */
export const stop = path => liftF(new Stop({ path }));

const _noop = new NOOP();

/**
 * noop
 * @private
 */
export const noop = () => _noop;
