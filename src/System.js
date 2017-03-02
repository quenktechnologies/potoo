import property from 'property-seek';
import { merge, oreduce } from './util';
import { type, force, any, or } from './be';
import { match } from './Match';
import { Maybe, Free } from './monad';
import { Type, copy } from './Type';
import { ActorT, LocalT, ActorL, ActorContext } from './Actor';
import * as lens from './lens';

/**
 * InvalidActorPathError
 * @param {string} path
 */
export function InvalidActorPathError(path) {

    this.message = `The path '${path}' is either invalid or in use!`;
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

InvalidActorPathError.prototype = Object.create(Error.prototype);
InvalidActorPathError.prototype.constructor = InvalidActorPathError;

/**
 * Op
 */
export class Op extends Type {

    map(f) {

        return match(this)
            .caseOf(Spawn, () => new Spawn(merge(this, { next: f(this.next) })))
            .caseOf(Send, () => new Send(merge(this, { next: f(this.next) })))
            .caseOf(Receive, () => new Receive(merge(this, { next: f(this.next) })))
            .end();

    }

}

/**
 * Spawn represents a request to create a new actor by its parent.
 */
export class Spawn extends Op {

    constructor(props) {

        super(props, {
            template: type(ActorT),
            parent: type(String),
            next: any
        });

    }
}

/**
 * Send represents a request to send a message to another actor.
 * @property {to} string
 * @property {string} from
 * @property {*} message
 */
export class Send extends Op {

    constructor(props) {

        super(props, {
            from: type(String),
            to: type(String),
            message: any,
            next: any
        });

    }
}

/**
 * Receive represents a request to receive the latest message
 */
export class Receive extends Op {

    constructor(props) {

        super(props, {

            behaviour: type(Function),
            path: type(String),
            next: any

        });

    }

}

/**
 * Drop represents a request to drop a message.
 * @property {to} string
 * @property {string} from
 * @property {*} message
 */
export class Drop extends Send {}

/**
 * exec
 * @summary { (Free,System) →  System }
 */
export const exec = (sys, free) =>
    free
    .resume()
    .cata(x => match(x)
        .caseOf(Spawn, execSpawn(sys))
        .caseOf(Send, deliverMessage(sys))
        .caseOf(Receive, receiveMessage(sys))
        .end(), y => y)

/**
 * execSpawn
 * @param {System} sys
 * @param {Spawn} request
 * @return {System}
 */
export const execSpawn = sys => ({ parent, template }) => match(template)
    .caseOf(LocalT, ({ id, start }) =>
        lens.set(
            actorCheckedLens(address(parent, id)),
            new ActorL({
                parent,
                path: address(parent, id),
                ops: start(new ActorContext({ self: address(parent, id), parent })),
                template
            }), sys))
    .end();

/**
 * deliverMessage
 * @summary {System →  Send →  System}
 */
export const deliverMessage = sys => send =>
    Maybe
    .not(sys.actors[send.to])
    .map(actor => lens.set(actorLens(send.to), actor.accept(send), sys))
    .orElse(() => sys.accept(send))
    .just();

/**
 * receiveMessage
 * @summary {System →  Receive →  System}
 */
export const receiveMessage = sys => receive =>
    Maybe
    .not(sys.actors[receive.path])
    .chain(actor =>
        Maybe
        .not(actor.mailbox[0])
        .map(msg => {

            if (receive.pattern)
                if (receive.pattern(msg) === false)
                    return copy(sys, { ops: sys.ops.concat(receive) });

                //@todo error handling on behaviour execution
            return copy(sys, {
                ops: sys.ops.concat(receive.behaviour(msg)).filter(x => x)
            })

        })
        .orElse(() => copy(sys, { ops: sys.ops.concat(receive) })))
    .orElse(() => Maybe.of(sys.accept(receive)))
    .just();


/**
 * drain the ops from an actor
 * @param {System} sys
 * @param {Actor} actor
 * @return {System}
 * @summary {(Actor,System) →  System}
 */
export const drain = (sys, actor) =>
    copy(sys, {
        ops: actor.ops ? sys.ops.concat(actor.ops) : sys.ops,
        actors: merge(sys.actors, {
            [actor.path]: copy(actor, { ops: null })
        })
    });


/**
 * qLens
 */
export const qLens = path => (op, sys) => {

    if (sys === undefined) {

        return lens.path(path)

    } else {

        return lens.set(lens.path(path),
            lens.set(lens.index(lens.TAIL), op, lens.path(path)(sys)), sys);

    }

}

/**
 * actorLens
 */
export const actorLens = path => (actor, sys) => (sys === undefined) ?
    actor.actors[path] : property(`actors[${path}]`, actor, sys);

/**
 * actorCheckedLens
 */
export const actorCheckedLens = path => (actor, sys) => {

    if (sys === undefined)
        if (property(`actors[${path}]`, sys) != null)
            throw new InvalidActorPathError(path);

    return actorLens(path)(actor, sys);

}

/**
 * address generates an address for a local actor
 * @summary { (string,string) →  string
 */
const address = (p, c) => (p === '') ? c : `${p}/${c}`;
const opsLens = qLens('ops');

/**
 * System
 * @property {Array<Op>} ops
 */
export class System extends Type {

    constructor(props) {

        super(props, {
            ops: or(type(Array), force([])),
            actors: or(type(Object), force({}))
        });

    }

    /**
     * accept a message for the system actor. Usually a dead letter or system command.
     * @param {Send} message
     */
    accept(message) {

        //@todo filter our and log dropped messages
        console.log('dead message', message);
        return this;

    }

    /**
     * spawn a new actor
     * @param {ActorT} template
     * @return {System}
     */
    spawn(template) {

        return new System(lens.set(opsLens,
            Free.liftF(new Spawn({ template, parent: '' })), this));

    }

    /**
     * tick acts as the scheduler, scheduling system computations including
     * those of child actors.
     * @summary { () →  System}
     */
    tick() {

        return oreduce(this.actors, drain, this);

    }

    /** tock runs the computations of the actor system.
     * @summary { System →  Free →  System}
     */
    tock(f) {

        return this.ops.slice().reduce(exec, copy(this, { ops: [] }));

    }

    start() {



    }

}
