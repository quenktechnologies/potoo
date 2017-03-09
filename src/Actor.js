import { v4 } from 'uuid';
import { type, force, call, kind, or } from './be';
import { Type } from './Type';
import { Free, IO } from './monad';
import { IO } from './monad';
import { omap } from './util';
import { sendF, ioopF, stopF, noopF, spawnF, receiveF } from './Op';
import { makeMVar } from 'potoo-lib/MVar';
import { MVar } from './MVar';
import { match } from './Match';

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
            id: call(v4),
            to: type(String),
            future: kind(Future)
        });

    }

}

/**
 * Actor
 */
export class Actor extends Type {}

/**
 * ActorS
 */
export class ActorS extends Actor {

    constructor(props) {

        super(props, {
            path: force(''),
            ops: or(type(Free), force(null))
        });

    }

}

/**
 * ActorL
 */
export class ActorL extends Actor {

    constructor(props) {

        super(props, {

            parent: type(String),
            path: type(String),
            mailbox: or(type(Array), force([])),
            ops: or(type(Free), force(null)),
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
            path: call(v4),
            to: type(String),
            abort: type(Function),
            mvar: type(MVar)
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
 * ActorList
 */
export class ActorList extends Type {

    constructor(props) {

        super(props, {

            list: type(Array)

        });

    }

}

const _nextActorFT = () => ioopF(a => a.mvar.take()
    .map(op => op != null ?
        op.chain(() => stopF(a.path)) :
        noopF()));

/**
 * next extracts the next Op from an Actor instance
 * @param {Actor} a
 * @summary {Actor →  Free<Op, null>}
 */
export const next = a => match(a)
    .caseOf(ActorFT, _nextActorFT)
    .caseOf(ActorL, a => a.ops ? a.ops : noopF())
    .caseOf(ActorS, a => a.ops ? a.ops : noopF())
    .caseOf(ActorSTP, () => noopF())
    .end();

/**
 * accept allows an Actor to accept the latest message addressed to it.
 * @param {*} m
 * @summary {(Actor,*) →  Actor|IO<Actor>|Drop}
 */
export const accept = (a, m) => match(a)
    .caseOf(ActorL, a => a.copy({ mailbox: a.mailbox.concat(m) }))
    .end();

/**
 * process executes a receive on an ActorL
 * @summary {(ActorL, Behaviour) →  ActorL}
 */
export const process = (a, b) => a.copy({ mailbox: a.mailbox.slice(1), ops: b(a.mailbox[0]) });

/**
 * map over an Actor treating it like a Functor
 * @summary {(Actor,Function) →  Actor}
 */
export const map = (a, f) => match(a)
    .caseOf(System, s => s.copy({ actors: omap(s.actors, f) }))
    .caseOf(ActorL, ({ ops, mailbox }) => a.copy(f({ ops, mailbox })))
            .end();

            /**
             * future spawns a temporary child actor that listens waits
             * on the result of a user supplied Future.
             * @param {Future} ft
             * @return {Free<SpawnIO,null>}
             * @summary { Future →  Free<Spawn, null> }
             */
            export const future = ft =>
                ioopF(actor => makeMVar()
                    .chain(mvar => new IO(() =>
                            ft.fork(error =>
                                mvar.put(sendF(actor.path, error)),
                                message =>
                                mvar.put(sendF(actor.path, message))))
                        .map(abort => new ActorFT({ parent: actor.path, to: actor.path, mvar, abort }))))

            /**
             * spawn a new actor instance
             * @param {ActorT} t
             * @return {Free<Spawn, null>}
             * @summary {ActorT →  Free<Spawn, null>}
             */
            export const spawn = spawnF;

            /**
             * receive the next message from the mailbox.
             * @param {Behaviour} b
             * @return {Free<Receive, null>}
             * @summary {Behaviour →  Free<Receive, null>}
             */
            export const receive = receiveF;

            /**
             * tell sends a message to an actor address.
             * @param {string} a
             * @param {*} m
             * @return {Free<Send, null>}
             * @summary {(string, *) →  Free<Receive, null>}
             */
            export const tell = sendF;
