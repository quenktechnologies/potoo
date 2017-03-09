import property from 'property-seek';
import { head, partial } from './util';
import { type, force, any, or } from './be';
import { match } from './Match';
import { Maybe, IO, Free } from './monad';
import { Type } from './Type';
import { Actor, ActorS, LocalT, ActorL, ActorSTP, ActorList, next, map, accept, process } from './Actor';
import * as Op from './Op';
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

/**(m.orElse(() => Maybe.of(r)).just())
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
 * exec executes the Op provide an effect as the result
 * @summary {(Op, Actor) →  Effect}
 */
export const exec = (op, a) => match(op)
    .caseOf(Op.Spawn, execSpawn(a))
    .caseOf(Op.Send, execSend(a))
    .caseOf(Op.Receive, execReceive(a))
    .caseOf(Op.Stop, execStop(a))
    .caseOf(Op.IOOP, execIOOP(a))
    .caseOf(Op.NOOP, () => {})
    .end();


/**
 * execSpawn
 * @param {Actor} a
 * @summary {Actor →  Spawn →  Actor}
 */
export const execSpawn = a => op =>
    match(op.template)
    .caseOf(LocalT, ({ id, start }) => new ActorL({
        parent: a.path,
        path: address(a.path, id),
        ops: start(),
        template: op.template
    }))
    .end();

/**
 * execSend
 *@summary {Actor →  Send →  System →  Actor|IO|Drop
 */
export const execSend = a => op => s =>
    Maybe
    .not(s.actors[op.to])
    .map(actor => accept(actor, op.message))
    .orElse(() => Maybe.of(Op.drop(op.to, a.path, op.message)))
    .extract();

/**
 * execReceive
 * @summary {Actor →  Receive →  Actor}
 */
export const execReceive = a => op =>
    Maybe
    .not(head(a.mailbox))
    .map(() => process(a, op.behaviour))
    // .orElse(()=> Maybe.of(repeat(a, op)))
    .orElse(() => Maybe.of(a))
    .extract();

/**
 * execStop
 * @summary { () →  ActorSTP }
 */
export const execStop = () => op => new ActorSTP({ path: op.path });

/**
 * execIOOP
 * @summary {(Actor, System) →  IO}
 */
export const execIOOP = a => op => op.f(a);

/**
 * runEffects turns the Ops of an Actor into effects to be applied to the system.
 * @summary {(Free<Op,null>, Actor, Array<Effect>) →  Array<Effect>}
 */
export const runEffects = (f, a, table) =>
    Maybe
    .not(f)
    .map(f =>
        f.resume()
        .cata(op =>
            runEffects(f.next, a, putEffect(exec(a, op), op, a, table)),
            () => table))
    .orElse(() => Maybe.of(table))
    .extract();

/**
 * putEffect creates a new entry into the effect table.
 * @summary {(Op,Actor,Effect,Array) →  Array }
 */
export const putEffect = (op, actor, effect, table) =>
    table.concat(new Effect({ op, actor, effect }));

/**
 *  an actor's effect with the system.
 * @summary {(Effect,  System) →  System}
 */
export const reconcile = (a, s) => match(a)
    .caseOf(ActorSTP, a => removeActor(a.path, s))
    .caseOf(Actor, a => putActor(a, s))
    .caseOf(ActorList, l => l.reduce(reconcile, s))
    .caseOf(Op.Drop, op => log(op, s.actors[op.from], s))
    .caseOf(IO, io => s.copy({ io: io.concat(io) }))
    .caseOf(Function, f => reconcile(s, f(s)))
    .orElse(() => s)
    .end();

/**
 * log an Op to the oplog
 * @param {Op} op
 * @param {Actor} actor
 * @param {System} s
 * @summary {(Op, Actor, System) →  System}
 */
export const log = (op, actor, s) => {

    console.log(actor.path, op);
    return s;

}

/**
 * address generates an address for a local actor
 * @summary { (string,string) →  string
 */
export const address = (p, c) => (p === '') ? c : `${p}/${c}`;

/**
 * putActor
 * @private
 * @summary {(Actor, System) → System}
 */
export const putActor = (a, s) =>
    lens.set(actorCheckedLens(a.path), a, s);

/**
 * removeActor
 * @private
 * @summary {(string, System) →  System}
 */
export const removeActor = (p, s) => Object.keys(s.actors).reduce((o, k) => {

    if (k === p)
        return o;

    o[k] = s.actors[k];

    return o;

}, {});

const nextClock = f =>
    new IO(() => (process) ? process.nextTick(f) : setTimeout(f, 0))
    .chain(() => IO.of(null));

/**
 * Effect
 */
export class Effect extends Type {

    constructor(props) {

        super(props, {
            op: type(Op.Op),
            effect: any,
            actor: type(Actor)
        });

    }

}

/**
 * System
 * @property {Array<Op>} ops
 */
export class System extends Type {

    constructor(props) {

        super(props, {
            path: force(''),
            ops: or(type(Free), force(Op.noopF())),
            io: or(type(Array), force([])),
            oplog: or(type(Array), force([])),
            actors: or(type(Object), force({})),
        });

        this.map = partial(map, this);
        this.reduce = f => Object.keys(this.actors).reduce((s, k)=>f(s, this.actors[k]), this);

    }

    /**
     * drop a message
     * @param {Send} op
     * @param {Actor} actor
     * @summary {Send →  System}
     */
    drop(op, actor) {

        return log(Op.drop(op.to, op.message), actor, this);

    }

    /**
     * spawn a new actor
     * @param {ActorT} template
     * @return {System}
     */
    spawn(template) {

        return this.copy({ ops: this.ops.chain(() => Op.spawnF(template)) });

    }

    /**
     * tick acts as the scheduler, scheduling system computations including
     * those of child actors.
     * @summary { () →  System}
     */
    tick() {

        return this
            .map(a => runEffects(next(a), a, []))
            .reduce((s, a) => putActor(a.map(() => null), reconcile(s, a)))

    }

    /** tock runs the computations of the actor system.
     * @summary { () →  IO<System>}
     */
    tock() {

        return this.io
            .reduce((io, ion) => io.chain(s =>
                ion.map(r => reconcile(s, r))), IO.of(this.copy({ io: [] })));

    }

    /**
     * go
     * @summary { () => IO<null> }
     */
    clock() {

        return this.tick().tock().chain(s => nextClock(() => s.clock().run()));

    }

}
