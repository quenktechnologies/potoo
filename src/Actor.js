import { v4 } from 'uuid';
import { type, force, call, kind, or } from './be';
import { Type } from './Type';
import { IO, Free } from './monad';
import { partial } from './util';
import { spawn } from './Ops';
import { MVar } from './MVar';
import { match } from './Match';
import { exec } from './Exec';

/**
 * DuplicateActorIdError
 */
export function DuplicateActorIdError(path, id) {

    this.message = `Id '${id}' at path '${path}' is in use!`;
    this.path = path;
    this.id = id;
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

DuplicateActorIdError.prototype = Object.create(Error.prototype);
DuplicateActorIdError.prototype.constructor = DuplicateActorIdError;

export default DuplicateActorIdError

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */
export class ActorT extends Type {}

/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */
export class LocalT extends ActorT {

    constructor(props) {

        super(props, {

            id: type(String),
            start: or(type(Function), force(() => {}))

        });

    }

}

/**
 * FutureT is the template for spawning future actors.
 * @property {string} id
 * @property {string} to
 * @property {Future} future
 */
export class FutureT extends ActorT {

    constructor(props) {

        super(props, {
            id: call(() => `future-${v4()}`),
            mvar: type(MVar)
        });

    }

}

/**
 * Actor
 */
export class Actor extends Type {

    constructor(props, checks) {

        super(props, checks);

        this.fold = partial(fold, this);
        this.map = partial(map, this);

    }

}

/**
 * System
 * @property {Array<Op>} ops
 */
export class System extends Actor {

    constructor(props) {

        super(props, {
            path: force(''),
            ops: or(type(Free), force(null)),
            actors: or(type(Array), force([])),
        });

        this.spawn = t => this.copy({ ops: this.ops ? this.ops.chain(() => spawn(t)) : spawn(t) });
        this.tick = () => tick(this, IO.of(this.copy({ ops: null })));
        this.start = () => start(this);

    }

}

/**
 * ActorL
 */
export class ActorL extends Actor {

    constructor(props) {

        super(props, {

            id: type(String),
            parent: type(String),
            path: type(String),
            ops: or(type(Free), force(null)),
            mailbox: or(type(Array), force([])),
            actors: or(type(Array), force([])),
            template: type(ActorT)

        });

    }

}

/**
 * ActorFT contains a Future, a computation that we expect to be complete sometime
 * later.
 */
export class ActorFT extends Actor {

    constructor(props) {

        super(props, {
            path: type(String),
            ops: or(type(Free), force(null)),
            mvar: type(MVar),
            template: type(ActorT)
        });

    }

}

/**
 * ActorCP treats a child process like an actor.
 */
export class ActorCP extends Actor {

    constructor(props) {

        super(props, {});

    }

}

/**
 * ActorSTP is a stopped Actor ready for removal.
 */
export class ActorSTP extends Actor {

    constructor(props) {

        super(props, { path: type(String) });

    }

}

/**
 * Future represents some computation we are interested in getting the result of
 *hat may not complete now or run asynchronously. This class serves
 * as an interface for type checking.
 * @interface
 */
export class Future {

    /**
     * fork the Future
     * @param {function} onReject
     * @param {function} onResolve
     */
    fork() {}

}

/**
 * replace an actor with a new version.
 * Returns the parent actor (second arg) updated with the new actor.
 * If the parent path is the same path as the actor to replace, it is
 * replaced instead.
 * No change is made if the actor is not found.
 * @summary (Actor, Actor) →  Actor
 */
export const replace = (a, p) =>
    p.path === a.path ?
    a : p.map(c => c.path === a.path ? a : c.map(partial(replace, a)));

/**
 * map over an Actor treating it like a Functor
 * @summary {(Actor,Function) →  Actor}
 */
export const map = (a, f) => match(a)
    .caseOf(ActorFT, a => a)
    .caseOf(Actor, a => a.copy({ actors: a.actors.map(f) }))
    .end();

/**
 * get a child actor from its parent using its id
 * @summary (string,Actor) →  Actor|null
 */
export const get = (id, a) => a.fold((p, c) => p ? p : c.id === id ? c : null);

/**
 * put an actor into another making it a child
 * Returns the parent (child,parent) →  parent
 * @summary (Actor, Actor) →  Actor
 */
export const put = (a, p) => p.copy({ actors: p.actors.concat(a) });

/**
 * fold a data structure into an acumulated simpler one
 * @summary fold :: (Actor, *→ *, *) →  *
 */
export const fold = (o, f, accum) => match(o)
    .caseOf(ActorFT, () => accum)
    .caseOf(Actor, a => a.actors.reduce(f, accum))
    .end()

/**
 * accept allows an Actor to accept the latest message addressed to it.
 * @param {*} m
 * @summary {*,Actor) →  Actor|IO<Actor>|Drop}
 */
export const accept = (m, a) => match(a)
    .caseOf(ActorL, a => a.copy({ mailbox: a.mailbox.concat(m) }))
    .end();

/**
 * select an actor in the system using the specified path.
 * @summary (string, Actor) →  Actor|null
 */
export const select = (p, a) => fold(a, (hit, child) =>
    (hit ?
        hit :
        p === child.path ?
        child :
        p.startsWith(child.path) ?
        select(p, child) : null), null);

export const nextTick = f =>
    new IO(() => (process) ? process.nextTick(f) : setTimeout(f, 0))
    .chain(() => IO.of(null));

/**
 * tick
 * @summary tick :: (Actor, IO<System>) →  IO<System>
 */
export const tick = (a, io) =>
    exec(a.copy({ ops: null }), a.fold((io, c) => tick(c, io), io), a.ops);

/**
 * start the system.
 * Note: start does not actuall start the system but returns an IO class.
 * @summary start :: System →  IO<null>
 */
export const start = s => match(s)
    .caseOf(System, s => tick(s, IO.of(s)).chain(s => nextTick(() => start(s))))
    .end();
