import { fork } from 'child_process';
import { v4 } from 'uuid';
import { type, force, call, or } from './be';
import { Type } from './Type';
import { IO, Free } from './monad';
import { fromAny, Maybe } from './fpl/monad/Maybe';
import { partial } from './util';
import { spawn, tell, receive as opreceive, raise } from './Ops';
import { exec } from './Exec';
import { makeMVar, MVar } from './MVar';
import { match } from './Match';
import * as paths from './paths';

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
 * Template is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Actor →  Actor
 */
export class Template extends Type {}

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
 * ActorIO
 */
export class ActorIO extends Actor {}

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
            log: or(type(Function), force(_defaultLogger))
        });

        this.spawn = t => this.copy({ ops: this.ops ? this.ops.chain(() => spawn(t)) : spawn(t) });
        this.tick = () => tick(IO.of(this.copy({ ops: null })), this);
        this.start = () => start(this);

    }

}

/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */
export class LocalT extends Template {

    constructor(props) {

        super(props, {

            id: type(String),
            start: or(type(Function), force(() => {}))

        });

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
            template: type(Template)

        });

    }

}

/**
 * createActorL from a template
 * @summary createActorL :: (string,LocalT) →  ActorL
 */
export const createActorL = (parent, template) => new ActorL({
    id: template.id,
    parent,
    path: _address(parent, template.id),
    ops: template.start(),
    template
});

/**
 * FutureT is the template for spawning future actors.
 * @property {string} id
 * @property {string} to
 * @property {Future} future
 */
export class FutureT extends Template {

    constructor(props) {

        super(props, {
            id: call(() => `future-${v4()}`),
            to: or(type(String), force(paths.SELF)),
            f: type(Function)
        });

    }

}

/**
 * ActorFT contains a Future, a computation that we expect to be complete sometime
 * later.
 */
export class ActorFT extends ActorIO {

    constructor(props) {

        super(props, {
            id: type(String),
            path: type(String),
            ops: or(type(Free), force(null)),
            mvar: type(MVar),
            template: type(Template)
        });

    }

}

/**
 * createActorFT from a template
 * @summary createActorFT :: (string,FutureT) →  IO<ActorFT>
 */
export const createActorFT = (parent, template) =>
    makeMVar()
    .chain(mvar => IO.of(() => new ActorFT({
        id: template.id,
        parent,
        path: _address(parent, template.id),
        ops: opreceive(_ident),
        mvar,
        abort: template
            .f()
            .fork(error => mvar.put(raise(error)),
                m => mvar
                .put(tell(Maybe
                    .not(template.to)
                    .orJust(paths.SELF)
                    .extract(), m))),
        template
    })));

/**
 * StreamT
 */
export class StreamT extends Template {

    constructor(props) {

        super(props, {
            id: type(String),
            to: or(type(String), force(paths.SELF)),
            f: type(Function)
        });

    }

}

export class ActorST extends ActorIO {

    constructor(props) {

        super(props, {
            id: type(String),
            path: type(String),
            mvar: type(MVar),
            ops: or(type(Free), force(null))
        });

    }

}

/**
 * createActorST from a template
 * @summary createActorST :: (string, template) →  IO<ActorST>
 */
export const createActorST = (parent, template) =>
    makeMVar()
    .chain(mvar =>
        template.f(m => mvar.put(tell(template.to, m)))
        .map(() => new ActorST({
            id: template.id,
            path: _address(parent, template.id),
            ops: opreceive(_ident),
            mvar
        })));

/**
 * ParentT
 */
export class ParentT extends Template {

    constructor(props) {

        super(props, { id: type(String) });

    }

}

/**
 * ActorP
 */
export class ActorP extends ActorIO {

    constructor(props) {

        super(props, {

            id: type(String),
            process: type(Object),
            path: or(type(String), force(`process-${v4()}`)),
            ops: or(type(Free), force(null)),
            mvar: type(MVar)

        });

    }

}

/**
 * createActorP from a template
 * @summary createActorP :: (string, ParentT) →  IO<ActorP>
 */
export const createActorP = (parent, template) =>
    makeMVar()
    .chain(mvar => IO.of(() => {

        process.on('message', ({ message, to }) => mvar.put(tell(to, message)));

        return new ActorP({

            id: template.id,
            path: _address(parent, template.id),
            process,
            mvar,
            ops: opreceive(_ident),
            template

        });

    }));

/**
 * ChildT
 */
export class ChildT extends Template {

    constructor(props) {

        super(props, { id: force(`child-${v4()}`) })

    }

}

/**
 * ActorCP
 */
export class ActorCP extends ActorIO {

    constructor(props) {

        super(props, {
            id: type(String),
            path: type(String),
            ops: or(type(Free), force(null)),
            mvar: type(MVar),
            handle: type(Object)
        });

    }
}

/**
 * createActorCP from a template
 * @summary createActorCP :: (string,ChildT) →  IO<ActorCP
 */
export const createActorCP = (parent, template) =>
    makeMVar()
    .chain(mvar =>
        _fork(template.start)
        .chain(handle => {

            handle.on('message', ({ to, message }) => mvar.put(tell(to, message)))

            return new ActorCP({
                id: template.id,
                path: _address(parent, template.id),
                handle,
                template,
                ops: opreceive(_ident)
            });

        }));


/**
 * ActorSTP is a stopped Actor ready for removal.
 */
export class ActorSTP extends Actor {

    constructor(props) {

        super(props, { path: type(String) });

    }

}

export const fromTemplate = (parent, template) => match(template)
    .caseOf(LocalT, partial(createActorL, parent))
    .caseOf(FutureT, partial(createActorFT, parent))
    .caseOf(StreamT, partial(createActorST, parent))
    .caseOf(ParentT, partial(createActorP, parent))
    .caseOf(ChildT, partial(createActorCP, parent))
    .end();

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
 * getChild gets a child actor from its parent using its id
 * @summary (string,Actor) →  Maybe<Actor>
 */
export const getChild = (id, a) => fromAny(a.fold((p, c) => p ? p : c.id === id ? c : null));

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
    .caseOf(ActorIO, () => accum)
    .caseOf(Actor, a => a.actors.reduce(f, accum))
    .end()

/**
 * accept allows an Actor to accept the latest message addressed to it.
 * @param {*} m
 * @summary {*,Actor) →  Actor|IO<Actor>|Drop}
 */
export const accept = (m, a) => match(a)
    .caseOf(ActorL, a => a.copy({ mailbox: a.mailbox.concat(m) }))
    .caseOf(ActorP, a => IO.of(() => { a.process.send(m); return a; }))
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
    IO.of(() => setTimeout(f, 100));

/**
 * tick
 * @summary tick :: (Actor, IO<Actor>) →  IO<Actor>
 */
export const tick = (io, a) =>
    exec(a.copy({ ops: null }), a.fold(tick, io), a.ops);

/**
 * start the system.
 * Note: start does not actuall start the system but returns an IO class.
 * @summary start :: System →  IO<null>
 */
export const start = s => match(s)
    .caseOf(System, s => tick(IO.of(s), s).chain(s => nextTick(() => start(s).run())))
    .end();

const _defaultLogger = op => IO.of(() => console.log(op));

const _address = (parent, id) => ((parent === '') || (parent === '/')) ? id : `${parent}/${id}`;

const _fork = path => IO.of(() => fork(`${__dirname}/process.js`, { env: { ACTOR_START: path } }));

const _ident = x => x;
