import { Suspend, Return } from 'afpl/lib/monad/Free';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { IO } from 'afpl/lib/monad/IO';
import { Free } from 'afpl/lib/monad/Free';
import { Functor } from 'afpl/lib/data/Functor';
import { SharedBuffer } from 'afpl/lib/async/SharedBuffer';
/**
 * DuplicateActorPathError
 */
export declare function DuplicateActorPathError(path: any): void;
export declare class DroppedMessage {
    message: string;
    to: string;
    from: string;
    constructor(message: any, to: any, from: any);
}
export declare class StoredMessage<M> {
    path: string;
    message: M;
    constructor(path: string, message: M);
}
export interface Behaviour {
    <M, A>(m: M): Instruction<A>;
}
export interface FinalBehaviour {
    <M>(m: M): void;
}
/**
 * Template
 */
export declare class Template {
    id: string;
    start: Behaviour;
    constructor(id: string, start?: Behaviour);
}
/**
 * LocalTConfig is the config info a LocalT template expects.
 */
export interface LocalTConfig {
    id: string;
    start?: Behaviour;
}
/**
 * LocalT is a template for creating a local actor
 * @property {string} id
 * @property {function} start
 */
export declare class LocalT extends Template {
    constructor({id, start}: LocalTConfig);
}
/**
 * Actor
 */
export declare class Actor {
    id: string;
    path: string;
    behaviour: Behaviour;
    mailbox: SharedBuffer<any>;
    constructor(id: string, path: string, behaviour: Behaviour, mailbox?: SharedBuffer<any>);
}
/**
 * ActorL
 */
export declare class ActorL extends Actor {
}
/**
 * ActorWT
 */
export declare class ActorWT<N> extends Actor {
    askee: string;
    actor: Actor;
    next: Getter<N>;
    constructor(askee: string, actor: Actor, next: Getter<N>);
}
/**
 * ActorDOA
 */
export declare class ActorDOA extends Actor {
}
export interface SystemConfig {
    start: Behaviour;
    log?: Logger;
}
export interface Logger {
    <A>(m: A): IO<void>;
}
export interface TypedMap<T> {
    [key: string]: T;
}
/**
 * Signal
 */
export declare class Signal {
}
/**
 * Started is sent to an actor to signal it has been started.
 */
export declare class Started extends Signal {
}
/**
 * System acts as the root actor for any process.
 *
 * All actors are stored here except for ones that are children in seperate
 * process. In those cases, communication is passed through the local parent
 * reference.
 */
export declare class System extends Actor {
    actors: TypedMap<Actor>;
    log: Logger;
    constructor({start, log}: SystemConfig);
    /**
     * start the system
     */
    start(): IO<System>;
}
/**
 * system create a new actor system filling in the defaults if not provided.
 * @summary SystemConf →  System
 */
export declare const system: (config: SystemConfig) => System;
export interface Getter<B> {
    (a: any): B;
}
/**
 * Axiom represents a member of the userland DSL.
 *
 * Typically corresponds to one of the actor model axioms.
 * @abstract
 */
export declare class Axiom<N> implements Functor<N> {
    next: N | Getter<N>;
    constructor(next?: N | Getter<N>);
    /**
     * map
     */
    map<A, B>(f: (a: A) => B): Axiom<B>;
}
/**
 * Spawn
 */
export declare class Spawn<N> extends Axiom<N> {
    template: Template;
    next: N;
    constructor(template: Template, next?: N);
}
/**
 * Task
 */
export declare class Task<N> extends Axiom<N> {
    forkable: Future;
    to: string;
    next: N;
    constructor(forkable: Future, to: string, next?: N);
}
/**
 * Tell
 */
export declare class Tell<N> extends Axiom<N> {
    to: string;
    message: string;
    next: N;
    constructor(to: string, message: string, next?: N);
}
/**
 * Ask
 */
export declare class Ask<N> extends Axiom<N> {
    askee: string;
    message: string;
    next: Getter<N>;
    constructor(askee: string, message: string, next?: Getter<N>);
}
/**
 * Effect
 */
export declare class Effect<R, N> extends Axiom<N> {
    runnable: IO<R>;
    next: Getter<N>;
    constructor(runnable: IO<R>, next?: Getter<N>);
}
export interface StreamFunction<P> {
    (f: (p: P) => System): void;
}
/**
 * Stream
 */
export declare class Stream<P, N> extends Axiom<N> {
    to: string;
    source: StreamFunction<P>;
    next: N;
    constructor(to: string, source: StreamFunction<P>, next?: N);
}
/**
 * Receive
 */
export declare class Receive<N> extends Axiom<N> {
    behaviour: Behaviour;
    constructor(behaviour: Behaviour);
}
export interface CPSFunction {
    <A>(f: (i: Instruction<A>) => void): void;
}
/**
 * CPS
 */
export declare class CPS<N> extends Axiom<N> {
    cont: CPSFunction;
    constructor(cont: CPSFunction);
}
/**
 * Raise
 */
export declare class Raise<N> extends Axiom<N> {
    error: Error;
    constructor(error: Error);
}
/**
 * Noop
 */
export declare class Noop<N> extends Axiom<N> {
}
export declare type Instruction<A> = Free<Axiom<any>, A>;
/**
 * runAxiomChain
 */
export declare const runAxiomChain: <A>(i: Free<Axiom<any>, A>, a: Actor, s: System) => System;
/**
 * evalAxiomChain translates a chain of axioms into the actual
 * work to be done by the system.
 */
export declare const evalAxiomChain: <A>(ch: Free<Axiom<any>, A>, a: Actor, s: System) => IO<System>;
/**
 * evalSpawn
 */
export declare const evalSpawn: <A>({template, next}: Spawn<Free<Axiom<any>, A>>, a: Actor, s: System) => IO<System>;
/**
 * evalTask
 */
export declare const evalTask: <A>({to, forkable, next}: Task<Free<Axiom<any>, A>>, a: Actor, s: System) => IO<System>;
/**
 * evalTell
 */
export declare const evalTell: <A>(op: Tell<Free<Axiom<any>, A>>, a: Actor, s: System) => IO<System>;
/**
 * evalAsk
 */
export declare const evalAsk: <A>(op: Ask<Free<Axiom<any>, A>>, a: Actor, s: System) => IO<System>;
/**
 * evalEffect
 */
export declare const evalEffect: <R, A>(eff: Effect<R, Free<Axiom<any>, A>>, a: Actor, s: System) => IO<System>;
/**
 * evalStream
 */
export declare const evalStream: <A, P>({source, to, next}: Stream<P, Free<Axiom<any>, A>>, a: Actor, s: System) => IO<System>;
/**
 * evalReceive
 */
export declare const evalReceive: <A>({behaviour}: Receive<Free<Axiom<any>, A>>, a: Actor, s: System) => IO<System>;
/**
 * evalCPS
 */
export declare const evalCPS: <A>({cont}: CPS<A>, a: Actor, s: System) => IO<System>;
/**
* raiseDup
*/
export declare const raiseDup: (p: string) => Free<Axiom<any>, any>;
/**
 * makeChildPath creates a child path given an actor and a child id
 */
export declare const makeChildPath: (id: string, parent: string) => string;
/**
 * allocateActor creates and puts an actor into the system.
 */
export declare const allocateActor: (p: string, t: Template, s: System) => IO<System>;
/**
 * createActor
 */
export declare const createActor: (path: string, t: Template, _s: System) => IO<Actor>;
/**
 * evalNewActor evals the instructions of a freshly spawned actor.
 */
export declare const evalNewActor: (c: Actor, s: System) => IO<System>;
/**
 * putActor into the System
 */
export declare const putActor: (path: string, a: Actor, s: System) => IO<System>;
/**
 * pathToActor resolves an actor address from the system.
 * If the actor is not found the '?' actor is returned.
 * @param {string} p The path of the actor
 * @param {Actor} a The actor making the query
 * @param {System} s The System.
 */
export declare const pathToActor: (p: string, a: Actor, s: System) => IO<Actor>;
/**
 * getActorMaybe is like getActor but wraps the actor in a Maybe.
 * @param p The path of the actor
 * @param s The System.
 */
export declare const getActorMaybe: (p: string, s: System) => IO<Maybe<Actor>>;
/**
 * getActor retrieves an actor from the system.
 * @param p The path to the actor.
 * @param s The System.
 */
export declare const getActor: (p: string, s: System) => IO<Actor>;
/**
 * feedActor feeds a message into an actor.
 * The message may be processed immediately or stored for later.
 */
export declare const feedActor: <A>(m: A, to: Actor, a: Actor, s: System) => IO<Actor>;
/**
 * feedActorDOA handles bounced messages
 * @param {DroppedMessage} m
 * @param {ActorDOA} a
 */
export declare const feedActorDOA: <A>(m: A, to: Actor, a: ActorDOA, s: System) => IO<Actor>;
/**
 * feedActorL
 */
export declare const feedActorL: <A>(m: A, a: ActorL, _from: Actor, s: System) => IO<any>;
/**
 * feedActorWT
 */
export declare const feedActorWT: <A>(m: A, a: ActorWT<any>, from: Actor, s: System) => IO<any>;
/**
 * takeMessage takes the next message out of an actor's mailbox.
 */
export declare const takeMessage: <A>(a: Actor) => IO<Maybe<A>>;
/**
 * storeAuditedMessage audits the message then stores it
 * @param {*} m The message
 * @param {Actor} a
 * @param {System} s
 */
export declare const storeAuditedMessage: <M>(m: M, a: Actor, s: System) => IO<null>;
/**
 * storeMessage sends a message to an actor's mailbox
 */
export declare const storeMessage: <M>(m: M, a: Actor) => IO<null>;
/**
 * takeBehaviour gets the next behaviour of an actor.
 * The behaviour is removed from the actor to prevent duplicate processing.
 */
export declare const takeBehaviour: (a: Actor) => IO<Maybe<Behaviour>>;
export declare const consumeOrStore: <A>(mb: Maybe<A>, b: Behaviour, a: Actor, s: System) => IO<System>;
/**
 * putBehaviour changes the behaviour of an Actor.
 * @param {Behaviour} b
 * @param {Actor} a
 */
export declare const putBehaviour: (b: Behaviour, a: Actor) => IO<Actor>;
/**
 * delayIO delays the execution of an IO function
 */
export declare const delayIO: <A>(f: () => IO<A>, n?: number) => IO<void>;
/**
 * spawn a new child actor
 */
export declare const spawn: (template: Template) => Free<Axiom<any>, any>;
/**
 * tell another actor a message
 */
export declare const tell: (to: string, message: any) => Free<Axiom<any>, any>;
export declare const ask: (askee: string, message: any) => Free<Axiom<any>, any>;
/**
 * task allows an asynchronous operation to be performed, placing its result in
 * an actor's mailbox.
 */
export declare const task: (f: Future, to?: string) => Free<Axiom<any>, any>;
/**
 * effect allows a side-effectfull computation to occur.
 */
export declare const effect: <R>(f: () => R) => Free<Axiom<any>, any>;
/**
 * run an IO operation safely
 */
export declare const run: <R>(io: IO<R>) => Suspend<Functor<Return<{}>>, {}>;
/**
 * stream input into an actor's mailbox
 */
export declare const stream: <P>(source: StreamFunction<P>, to?: string) => Free<Axiom<any>, any>;
/**
 * receive the next message with the passed behaviour
 */
export declare const receive: (behaviour: Behaviour) => Free<Axiom<any>, any>;
/**
 * cps is helpfull when interacting with typical node callback based apis
 *
 * The evaluation of the instructions the actor wants executed is delayed
 * until the passed callback is invoked.
 *
 */
export declare const cps: (f: CPSFunction) => Free<Axiom<any>, any>;
/**
 * finalReceive receives the next message and effectively puts the actor into
 * an idle state.
 */
export declare const finalReceive: <M>(b: (m: M) => void) => Free<Axiom<any>, any>;
/**
 * raise an error within the system.
 * This function gives the supervisor (if any) a chance to
 * intercept and react to the error. It also terminates
 * the current chain of instructions.
 */
export declare const raise: (error: Error) => Free<Axiom<any>, any>;
/**
 * noop means do nothing, effectively putting the Actor in an idle mode forever.
 */
export declare const noop: () => Free<Axiom<any>, any>;
