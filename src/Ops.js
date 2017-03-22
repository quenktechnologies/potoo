import { v4 } from 'uuid';
import { merge, compose, partial } from './util';
import { type, any, call, or, force } from './be';
import { liftF, Maybe, IO } from './monad';
import { Type } from './Type';
import { match } from './Match';
import { paths } from './paths';
import * as Actor from './Actor';

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
 * Spawn
 * @property {Template} template
 */
export class Spawn extends Op {

    constructor(props) {

        super(props, { template: type(Actor.Template) });

    }

}

/**
 * Future
 */
export class Future extends Op {

    constructor(props) {

        super(props, { f: type(Function), to: or(type(String), force(null)) });

    }

}

/**
 * Stream
 */
export class Stream extends Op {

    constructor(props) {

        super(props, { f: type(Function) });

    }

}

/**
 * Tell
 */
export class Tell extends Op {

    constructor(props) {

        super(props, { to: type(String), message: any });

    }

}

/**
 * Receive
 */
class Receive extends Op {

    constructor(props) {

        super(props, { behaviour: type(Function) });

    }

}

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
export class Put extends Getter {

    constructor(props) {

        super(props, { actor: type(Actor.Actor) });

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
export class Accept extends Getter {

    constructor(props) {

        super(props, { message: any, actor: type(Actor.Actor) });

    }

}

export class AcceptIO extends Getter {

    constructor(props) {

        super(props, { message: any, actor: type(Actor.ActorIO) });

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

            actor: type(Actor.Actor)

        });

    }

}

/**
 * Update
 */
export class Update extends Op {

    constructor(props) {

        super(props, { actor: type(Actor.Actor) });

    }

}

/**
 * Output
 */
export class Output extends Op {

    constructor(props) {

        super(props, { f: type(Function) });

    }

}

/**
 * Input
 */
export class Input extends Getter {

    constructor(props) {

        super(props, { f: type(Function) });

    }

}

/**
 * Log
 * @property {Op} op
 * @property {Free<Op, null>} [next]
 */
export class Log extends Getter {

    constructor(props) {

        super(props, { op: type(Op) });

    }

}

export class NOOP extends Op {}

export const noop = () => liftF(new NOOP());

/**
 * map over an Op
 * @summary {Op<A> →  (A→ B) Op<B>}
 */
export const map = op => f => match(op)
    .caseOf(Getter, ({ next }) => op.copy({ next: compose(f, next) }))
    .caseOf(Op, ({ next }) => op.copy({ next: f(next) }))
    .end();

/**
 * future spawns a temporary child actor that listens waits
 * on the result of a user supplied Future.
 * @param {Future} ft
 * @return {Free<SpawnIO,null>}
 * @summary {  ((null →  Future),string) →  Free<O,*> }
 */
export const future = (f, to) =>
    log(new Future({ f, to }))
    .chain(() => spawn(new Actor.FutureT({ f, to })));

/**
 * stream a potentially infinite amount of messages to the actor.
 * @summary stream :: (((* →  IO) →  IO),string) →  Free<Put, N>
 */
export const stream = (f, to) =>
    log(new Stream({ f, to }))
    .chain(() => spawn(new Actor.StreamT({ f, to, id: `stream-${v4()}` })));

/**
 * spawn creates a new spawn request
 * @param {Template} template
 * @return {Free}
 * @summary {Template →  Free<Raise|Update, null>}
 */
export const spawn = template =>
    log(new Spawn({ template }))
    .chain(self)
    .chain(partial(make, template))

/**
 * self gets the actor for the current context.
 * @summary {self :: null →  Free<F, ActorL>
 */
export const self = () => liftF(new Self({ next }));

/**
 * system provides the system
 * @summary system :: () →  Free<System,null>
 */
export const system = () => liftF(new System({ next }));

/**
 * get returns a child actor based on id if it exists
 * @summary {(string) →  Free<Get, Actor|null>
 */
export const get = id => liftF(new Get({ id, next }));

/**
 * tell another actor a message
 * @summary tell :: (string,*) →  Free<F, Actor>
 */
export const tell = (to, message) =>
    log(new Tell({ to, message }))
    .chain(self)
    .chain(src =>
        select(to)
        .chain(dest => match(dest)
            .caseOf(Actor.ActorIO, a => accept({ to, message }, a))
            .caseOf(Actor.Actor, a => accept(message, a)).end())
        .chain((src.path === to || src.path == null) ? update : replace));

/**
 * select an actor based on an address
 * @summary select :: string →  Free<F,Actor>
 */
export const select = path => path === paths.SELF ? self() : liftF(new Select({ path, next }));

/**
 * accept a message
 * @summary accept :: (*, Actor) →  Free<F,Actor>
 */
export const accept = (message, actor) => match(actor)
    .caseOf(Actor.ActorIO, () => liftF(new AcceptIO({ message, actor, next })))
    .caseOf(Actor.Actor, () => liftF(new Accept({ message, actor, next })))
    .end();

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
 * put a new child actor into the list of children
 * @summary Actor →  Free<F,null>
 */
export const put = actor => liftF(new Put({ actor, next }));

/**
 * receive the next message and handle it with the passed behaviour
 * @summary receive :: (* → Free<F,*>) →  Free<null, null>
 */
export const receive = behaviour =>
    log(new Receive({ behaviour }))
    .chain(() => _receive(behaviour));

const _receive = behaviour =>
    self()
    .chain(partial(dequeue, behaviour))

/**
 * dequeue a message from an actor's mailbox
 * @summary dequeue :: (b, a) →  Free<O,*>
 */
export const dequeue = (b, a) => match(a)
    .caseOf(Actor.ActorIO, ({ mvar }) =>
        input(() =>
            mvar
            .take()
            .map(Maybe.not))
        .chain(mayb =>
            mayb
            .map(m => a.copy({ ops: b(m) }))
            .orJust(a.copy({ ops: _receive(b) }))
            .map(update)
            .extract()))
    .caseOf(Actor.ActorL, a =>
        Maybe
        .not(a.mailbox[0])
        .map(m => a.copy({ ops: b(m) }))
        .orJust(a.copy({ ops: _receive(b) }))
        .map(update)
        .extract()).end();

/**
 * input is used for executing side effects and getting the result.
 * @summary input :: (null →  IO<*>)→  Free<Input, null>
 */
export const input = f => log(new Input({ f, next })).chain(liftF);

/**
 * output is used for executing side effects when we don't care about the result
 * @summary output :: (* →  IO<null>) →  Free<Output, null>
 */
export const output = f => log(new Output({ f })).chain(liftF);

/**
 * raise an error within the system.
 * This function gives the supervisor (if any) a chance to
 * intercept and react to the error. It also terminates
 * the current chain of instructions.
 * @summary raise :: Error →  Free<null,Error>
 */
export const raise = error => liftF(new Raise({ error }));

/**
 * log an Op
 * @summary log :: Op →  Free<Log, null>
 */
export const log = op => liftF(new Log({ op, next }));

/**
 * stop creates a new Stop request.
 * @param {string} path
 */
export const stop = path => liftF(new Stop({ path }));

/**
 * make a child actor
 * @summary make :: (Template, Actor) →  Free<Raise,N>|Free<Put,N>
 */
export const make = (template, parent) =>
    Maybe
    .not(Actor.get(template.id, parent))
    .map(() => raise(new Actor.DuplicateActorIdError(parent.path, template.id)))
    .orJust(create(parent.path, template).chain(update))
    .extract();

/**
 * create an actor, that's it does not add it to the system or
 * anything else.
 * @summary create :: (string, Template)  →  Free<Op,Actor>
 */
export const create = (parent, template) =>
    match(Actor.fromTemplate(parent, template))
    .caseOf(IO, io => input(() => io).chain(a => put(a)))
    .caseOf(Actor.Actor, put)
    .end();

/* Helpers */
const next = x => x;
