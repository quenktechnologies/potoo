import { match } from 'afpl/lib/control/Match';
import { Suspend, Return, liftF } from 'afpl/lib/monad/Free';
import { Maybe, fromAny } from 'afpl/lib/monad/Maybe';
import { IO, safeIO, wrapIO } from 'afpl/lib/monad/IO';
import { Free } from 'afpl/lib/monad/Free';
import { Functor } from 'afpl/lib/data/Functor';
import { identity, compose } from 'afpl/lib/util';
import { SharedBuffer } from 'afpl/lib/async/SharedBuffer';

/**
 * DuplicateActorPathError
 */
export function DuplicateActorPathError(path) {

    this.message = `The path '${path}' is already in use!`;
    this.path = path;
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

DuplicateActorPathError.prototype = Object.create(Error.prototype);
DuplicateActorPathError.prototype.constructor = DuplicateActorPathError;

export class DroppedMessage {

    message: string;
    to: string;
    from: string;

    constructor(message, to, from) {

        this.message = message;
        this.to = to;
        this.from = from;

    }

}

export class StoredMessage<M> {

    constructor(public path: string, public message: M) { }

}

export interface Behaviour { <M, A>(m: M): Instruction<A> }

export interface FinalBehaviour { <M>(m: M): void }

/* actors */

/**
 * Template 
 */
export class Template {

    constructor(
        public id: string,
        public start: Behaviour = noop) { }

};

/**
 * LocalTConfig is the config info a LocalT template expects.
 */
export interface LocalTConfig { id: string; start?: Behaviour }

/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */
export class LocalT extends Template {

    constructor({ id, start }: LocalTConfig) {

        super(id, start);

    }

}

/**
 * Actor
 */
export class Actor {

    constructor(
        public id: string,
        public path: string,
        public behaviour: Behaviour,
        public mailbox = new SharedBuffer<any>()) { }

}

/**
 * ActorL
 */
export class ActorL extends Actor { }

/**
 * ActorDOA
 */
export class ActorDOA extends Actor { }

/* system */

export interface SystemConfig { start: Behaviour; log?: Logger }

export interface Logger { <A>(m: A): IO<void> };

export interface TypedMap<T> { [key: string]: T; }

/**
 * Signal 
 */
export class Signal { }

/**
 * Started is sent to an actor to signal it has been started.
 */
export class Started extends Signal { }

/**
 * System acts as the root actor for any process.
 *
 * All actors are stored here except for ones that are children in seperate
 * process. In those cases, communication is passed through the local parent
 * reference.
 */
export class System extends Actor {

    actors: TypedMap<Actor>;
    log: Logger;

    constructor({ start, log = m => safeIO(() => console.log(m)) }: SystemConfig) {

        super('', '', start);

        this.actors = { '?': new ActorDOA('?', '?', noop) };
        this.log = log;

    }

    /**
     * start the system
     */
    start(): IO<System> {

        return evalAxiomChain(this.behaviour(new Started()), this, this);

    }

}

/**
 * system create a new actor system filling in the defaults if not provided.
 * @summary SystemConf →  System
 */
export const system = (config: SystemConfig) => new System(config);

/* Axioms */

export interface Getter<B> {

    (a: any): B;

}

/**
 * Axiom represents a member of the userland DSL.
 *
 * Typically corresponds to one of the actor model axioms.
 * @abstract
 */
export class Axiom<N> implements Functor<N> {

    constructor(public next?: N | Getter<N>) { }

    /**
     * map
     */
    map<A, B>(f: (a: A) => B): Axiom<B> {

        return match(this)
            .caseOf(Receive, identity)
            .caseOf(Raise, identity)
            .caseOf(Spawn, ({ template, next }) => new Spawn(template, f(next)))
            .caseOf(Task, ({ to, forkable, next }) => new Task(forkable, to, f(next)))
            .caseOf(Tell, ({ to, message, next }) => new Tell(to, message, f(next)))
            .caseOf(Effect, ({ runnable, next }) => new Effect(runnable, compose(f, next)))
            .caseOf(Stream, ({ to, source, next }) => new Stream(to, source, f(next)))
            .caseOf(Noop, identity)
            .end();

    }

}

/**
 * Spawn
 */
export class Spawn<N> extends Axiom<N> {

    constructor(public template: Template, public next?: N) {

        super(next);

    }

}

/**
 * Task 
 */
export class Task<N> extends Axiom<N> {

    constructor(public forkable: Future, public to: string, public next?: N) {

        super(next);

    }

}

/**
 * Tell
 */
export class Tell<N> extends Axiom<N> {

    constructor(public to: string, public message: string, public next?: N) {

        super(next);

    }

}

/**
 * Effect 
 */
export class Effect<R, N> extends Axiom<N> {

    constructor(public runnable: IO<R>, public next: (a: any) => N = identity) {

        super(next);

    }

}

export interface StreamFunction<P> {
    (f: (p: P) => System): void;
}
/**
 * Stream 
 */
export class Stream<P, N> extends Axiom<N> {

    constructor(public to: string, public source: StreamFunction<P>, public next?: N) {

        super(next);

    }

}

/**
 * Receive
 */
export class Receive<N> extends Axiom<N> {

    constructor(public behaviour: Behaviour) {

        super();

    }

}

/**
 * Raise
 */
export class Raise<N> extends Axiom<N> {

    constructor(public error: Error) { super(); }

}

/**
 * Noop 
 */
export class Noop<N> extends Axiom<N> { }

export type Instruction<A> = Free<Axiom<any>, A>;

/**
 * runAxiomChain 
 */
export const runAxiomChain = <A>(i: Instruction<A>, a: Actor, s: System): System =>
    console.log('running ') ||
    evalAxiomChain(i, a, s).run();

/**
 * evalAxiomChain translates a chain of axioms into the actual
 * work to be done by the system.
 */
export const evalAxiomChain = <A>(ch: Instruction<A>, a: Actor, s: System): IO<System> =>
    match(ch)
        .caseOf(Suspend, ({ f }) => match(f)
            .caseOf(Spawn, f => s.log(f).chain(() => evalSpawn(f, a, s)))
            .caseOf(Task, f => s.log(f).chain(() => evalTask(f, a, s)))
            .caseOf(Tell, f => s.log(f).chain(() => evalTell(f, a, s)))
            .caseOf(Effect, f => s.log(f).chain(() => evalEffect(f, a, s)))
            .caseOf(Stream, f => s.log(f).chain(() => evalStream(f, a, s)))
            .caseOf(Receive, f => s.log(f).chain(() => evalReceive(f, a, s)))
            .caseOf(Raise, ({ error }) => { throw error; })
            .caseOf(Noop, f => s.log(f).chain(() => wrapIO(s)))
            .end())
        .caseOf(Return, () => wrapIO(s))
        .end();

/**
 * evalSpawn
 */
export const evalSpawn = <A>({ template, next }: Spawn<Instruction<A>>, a: Actor, s: System): IO<System> => {

    let p = makeChildPath(template.id, a.path);

    return getActorMaybe(p, s)
        .chain(mb =>
            mb.map(() => evalAxiomChain(raiseDup(p), a, s))
                .orJust(() =>
                    allocateActor(p, template, s)
                        .chain(() => evalAxiomChain(next, a, s)))
                .get());

};

/**
 * evalTask
 */
export const evalTask = <A>({ to, forkable, next }: Task<Instruction<A>>, a: Actor, s: System): IO<System> =>

    safeIO(() => {
        forkable.fork(
            e => evalAxiomChain(raise(e), a, s).run(),
            m => evalAxiomChain(tell(to, m), a, s).run())
        return s;
    }).chain(() => evalAxiomChain(next, a, s))

/**
 * evalTell
 */
export const evalTell = <A>({ to, message, next }: Tell<Instruction<A>>, a: Actor, s: System): IO<System> =>
    pathToActor(to === '.' ? a.path : to, s)
        .chain(t => feedActor(message, t, a, s))
        .chain(() => evalAxiomChain(next, a, s));

/**
 * evalEffect 
 */
export const evalEffect = <R, A>(eff: Effect<R, Instruction<A>>, a: Actor, s: System): IO<System> => {
    let { runnable, next } = eff;
    return runnable.chain(r => evalAxiomChain(next(r), a, s));
};

/**
 * evalStream 
 */
export const evalStream = <A, P>({ source, to, next }: Stream<P, Instruction<A>>, a: Actor, s: System): IO<System> =>
    safeIO(() => source(p => runAxiomChain(tell(to, p), a, s)))
        .chain(() => evalAxiomChain(next, a, s));

/**
 * evalReceive
 */
export const evalReceive = <A>({ behaviour }: Receive<Instruction<A>>, a: Actor, s: System): IO<System> =>
    takeMessage(a).chain(mb => consumeOrStore(mb, behaviour, a, s));

/**
* raiseDup 
*/
export const raiseDup = (p: string) => raise(new DuplicateActorPathError(p));

/**
 * makeChildPath creates a child path given an actor and a child id
 */
export const makeChildPath = (id: string, parent: string): string =>
    ((parent === '/') || (parent === '')) ? `${parent}${id}` : `${parent}/${id}`;

/**
 * allocateActor creates and puts an actor into the system.
 */
export const allocateActor = (p: string, t: Template, s: System): IO<System> =>
    createActor(p, t, s).chain(c => putActor(p, c, s).chain(s => evalNewActor(c, s)));

/**
 * createActor
 */
export const createActor = (path: string, t: Template, _s: System): IO<Actor> => match(t)
    .caseOf(LocalT, t => wrapIO(new ActorL(t.id, path, t.start)))
    .end();

/**
 * evalNewActor evals the instructions of a freshly spawned actor.
 */
export const evalNewActor = (c: Actor, s: System) =>
    takeBehaviour(c).chain(mb =>
        mb.map(b => evalAxiomChain(b(new Started()), c, s))
            .orJust(() => wrapIO(s))
            .get())

/**
 * putActor into the System
 */
export const putActor = (path: string, a: Actor, s: System): IO<System> =>
    safeIO(() => { s.actors[path] = a; return s; });

/**
 * pathToActor resolves an actor address from the system.
 * If the actor is not found the '?' actor is returned.
 * @param p The path of the actor
 * @param s The System.
 */
export const pathToActor = (p: string, s: System): IO<Actor> =>
    getActorMaybe(p, s).map(mb => mb.orJust(() => s.actors['?']).get());

/**
 * getActorMaybe is like getActor but wraps the actor in a Maybe.
 * @param p The path of the actor
 * @param s The System.
 */
export const getActorMaybe = (p: string, s: System): IO<Maybe<Actor>> =>
    getActor(p, s).map(fromAny);

/**
 * getActor retrieves an actor from the system.
 * @param p The path to the actor.
 * @param s The System.
 */
export const getActor = (p: string, s: System): IO<Actor> => safeIO(() => s.actors[p])

/**
 * feedActor feeds a message into an actor.
 * The message may be processed immediately or stored for later.
 */
export const feedActor = <A>(m: A, to: Actor, from: Actor, s: System): IO<Actor> => match(to)
    .caseOf(ActorDOA, a => feedActorDOA(new DroppedMessage(m, a, from.path), a, s))
    .caseOf(ActorL, a => feedActorL(m, a, s))
    .end();

/**
 * feedActorDOA handles bounced messages
 * @param {DroppedMessage} m 
 * @param {ActorDOA} a 
 */
export const feedActorDOA = (m: DroppedMessage, a: ActorDOA, s: System): IO<Actor> =>
    s.log(m).mapIn(a);

/**
 * feedActorL
 */
export const feedActorL = <A>(m: A, a: ActorL, s: System): IO<any> => match(a.behaviour)
    .caseOf(Function, b => delayIO(() => evalAxiomChain(b(m), a, s)))
    .orElse(() => storeAuditedMessage(m, a, s))
    .end();

/**
 * takeMessage takes the next message out of an actor's mailbox.
 */
export const takeMessage = <A>(a: Actor): IO<Maybe<A>> => a.mailbox.maybeTake();

/**
 * storeAuditedMessage audits the message then stores it
 * @param {*} m The message
 * @param {Actor} a 
 * @param {System} s 
 */
export const storeAuditedMessage = <M>(m: M, a: Actor, s: System) =>
    s.log(new StoredMessage(a.path, m)).chain(() => storeMessage(m, a));

/**
 * storeMessage sends a message to an actor's mailbox
 */
export const storeMessage = <M>(m: M, a: Actor): IO<null> => match(a)
    .caseOf(ActorL, a => a.mailbox.put(m))
    .end();

/**
 * takeBehaviour gets the next behaviour of an actor.
 * The behaviour is removed from the actor to prevent duplicate processing.
 */
export const takeBehaviour = (a: Actor): IO<Maybe<Behaviour>> =>
    safeIO(() => { let b = a.behaviour; a.behaviour = null; return fromAny(b); })

export const consumeOrStore = <A>(mb: Maybe<A>, b: Behaviour, a: Actor, s: System): IO<System> =>
    mb.map(m => feedActor(m, a, a, s)).orJust(() => putBehaviour(b, a).chainIn(s)).get()

/**
 * putBehaviour changes the behaviour of an Actor.
 * @param {Behaviour} b 
 * @param {Actor} a 
 */
export const putBehaviour = (b: Behaviour, a: Actor): IO<Actor> =>
    safeIO(() => { a.behaviour = b; return a; })

/**
 * delayIO delays the execution of an IO function
 */
export const delayIO = <A>(f: () => IO<A>, n = 100): IO<void> =>
    safeIO(() => void setTimeout(() => console.log('delat ') || f().run(), n));

/**
 * spawn a new child actor
 */
export const spawn = (template: Template): Instruction<any> => liftF(new Spawn(template));

/**
 * tell another actor a message
 */
export const tell = (to: string, message: any): Instruction<any> =>
    liftF(new Tell(to, message));

/**
 * task allows an asynchronous operation to be performed, placing its result in 
 * an actor's mailbox.
 */
export const task = (f: Future, to: string = '.'): Instruction<any> =>
    liftF(new Task(f, to));

/**
 * effect allows a side-effectfull computation to occur.
 */
export const effect = <R>(f: () => R) => liftF(new Effect(safeIO(f)));

/**
 * run an IO operation safely 
 */
export const run = <R>(io: IO<R>) => liftF(new Effect(io));

/**
 * stream input into an actor's mailbox
 */
export const stream = <P>(source: StreamFunction<P>, to: string = '.'): Instruction<any> =>
    liftF(new Stream(to, source));

/**
 * receive the next message with the passed behaviour
 */
export const receive = (behaviour: Behaviour): Instruction<any> => liftF(new Receive(behaviour));

/**
 * finalReceive receives the next message and effectively puts the actor into
 * an idle state.
 */
export const finalReceive = <M>(b: (m: M) => void): Instruction<any> =>
    liftF(new Receive(m => b(m) || noop()));

/**
 * raise an error within the system.
 * This function gives the supervisor (if any) a chance to
 * intercept and react to the error. It also terminates
 * the current chain of instructions.
 */
export const raise = (error: Error): Instruction<any> => liftF(new Raise(error));

/**
 * noop means do nothing, effectively putting the Actor in an idle mode forever.
 */
export const noop = (): Instruction<any> => liftF(new Noop());
