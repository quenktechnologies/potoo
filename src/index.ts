import * as Promise from 'bluebird';

export const INFO = 6;
export const WARN = 5;
export const ERROR = 1;

/**
 * DuplicateActorPathError
 */
export class DuplicateActorPathError extends Error {

    __proto__: object;

    constructor(path: string) {

        super(`The path '${path}' is already in use!`);

        this.stack = (new Error(this.message)).stack;

        if (Error.hasOwnProperty('captureStackTrace'))
            Error.captureStackTrace(this, this.constructor);

        (Object.setPrototypeOf) ?
            Object.setPrototypeOf(this, DuplicateActorPathError.prototype) :
            this.__proto__ = DuplicateActorPathError.prototype;

    }

}

DuplicateActorPathError.prototype = Object.create(Error.prototype);
DuplicateActorPathError.prototype.constructor = DuplicateActorPathError;

/**
 * Message is an envelope for user messages.
 */
export class Message<M> {

    constructor(public to: string, public from: string, public message: M) { }

}

/**
 * makeChildPath creates a child path given an actor and a child id
 */
export const makeChildPath = (id: string, parent: string): string =>
    ((parent === '/') || (parent === '')) ? `${parent}${id}` : `${parent}/${id}`;

/**
 * ActorConf represents the minimum amount of information required to create
 * a new actor instance.
 */
export abstract class ActorConf<M> {

    constructor(public id: string) { }

    abstract create(path: string, s: System): Context<M>

};

/**
 * Context represents an actor's context within the system.
 * 
 * It stores interesting data as well as provides methods for manipulating
 * the actor's behaviour.
 */
export abstract class Context<M> {

    constructor(public path: string) { }

    abstract feed(m: Message<M>): void;

    abstract start(): void;

}

/**
 * PendingContext is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export class PendingContext<M> extends Context<M>{

    constructor(
        public askee: string,
        public original: Context<M>,
        public resolve: (m: M) => void,
        public system: System) { super(original.path); }

    feed(m: Message<M>) {

        if (m.from !== this.askee) {

            this.system.dropMessage(m);

        } else {

            this.system.putContext(this.original.path, this.original);
            this.resolve(m.message);

        }

    }

    start() { }

}

/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
export class LocalContext<M> extends Context<M> {

    constructor(
        public path: string,
        public actorFn: (c: LocalContext<M>) => LocalActor<M>,
        public system: System,
        public behaviour: Behaviour<M> = null,
        public mailbox: Message<M>[] = [],
        public isClearing: boolean = false) { super(path); }

    _clear(): boolean {

        if ((!this.isClearing) &&
            (this.behaviour !== null) &&
            (this.mailbox.length > 0) &&
            (this.behaviour.willConsume(this.mailbox[0].message))) {

            let b = this.behaviour;
            let m = this.mailbox.shift();

            this.isClearing = true;
            this.behaviour = null;

            b.consume(m.message);

            this.system.logging.messageReceived(m);
            this.isClearing = false;

            return true;

        } else {

            return false;

        }

    }

    _set(b: Behaviour<M>): LocalContext<M> {

        if (this.behaviour != null)
            throw new Error(`${this.path} is already receiveing/selecting!`);

        this.behaviour = b;

        return this;

    }

    discard<M>(m: Message<M>) {

        this.system.dropMessage(m);

    }

    spawn(t: ActorConf<M>) {

        return this.system.putChild(t, this.path);

    }

    tell<M>(ref: string, m: M) {

        this.system.putMessage(ref, this.path, m);

    }

    ask<M>(ref: string, m: M): Promise<M> {

        return this.system.askMessage(ref, this.path, m);

    }

    select(c: Case<M>[]) {

        this._set(new MatchCase(c));
        this.system.logging.selectStarted(this.path);
        this._clear();

    }

    receive(f: (m: any) => void) {

        this._set(new MatchAny(f));
        this.system.logging.receiveStarted(this.path);
        this._clear();

    }

    feed(m: Message<M>) {

        setTimeout(() => (this.mailbox.unshift(m), this._clear()), 0);

    }

    start() {

        this.actorFn(this).run();

    }

}

export interface Handler<T> {

    (t: T): void

}

/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export class Case<T> {

    constructor(public t: { new (...a: any[]): T } | T, public h: Handler<T>) { }

    /**
     * matches checks if the supplied type satisfies this Case
     */
    matches<M>(m: M): boolean {

        switch (typeof this.t) {

            case 'function':
                return m instanceof <Function><any>this.t

            default:
                return <any>this.t === <any>m;

        }

    }

    /**
     * apply the function of this Case to a message
     */
    apply(m: T) {

        this.h(m);

    }

}

/**
 * Behaviour of an actor
 */
export interface Behaviour<M> {

    willConsume<A>(m: A): boolean;
    consume(m: M): void;

}

/**
 * MatchAny accepts any value.
 */
export class MatchAny<M> implements Behaviour<M> {

    constructor(public f: (m: M) => void) { }

    static create<A>(f: (m: A) => void) {

        return new MatchAny(f);

    }

    willConsume<A>(_: A): boolean {

        return true;

    }

    consume(m: M): void {

        this.f(m);

    }

}

/**
 * MatchCase 
 */
export class MatchCase<M> implements Behaviour<M> {

    constructor(public cases: Case<M>[]) { }

    willConsume<A>(m: A) {

        return this.cases.some(c => c.matches(m));

    }

    consume(m: M) {

        this.cases.some(c => c.matches(m) ? (c.apply(m), true) : false);

    }

}

/**
 * LocalConf is a template for creating a local actor.
 * @property {string} id
 * @property {function} start
 */
export class LocalConf<M> extends ActorConf<M> {

    constructor(public id: string, public actorFn: (c: LocalContext<M>) => LocalActor<M>) {

        super(id);

    }

    /**
     * from constructs a new ActorConf using the specified parameters.
     */
    static from<M>(id: string, fn: (c: LocalContext<M>) => LocalActor<M>) {

        return new LocalConf(id, fn);

    }

    create(path: string, s: System): Context<M> {

        return new LocalContext(path, this.actorFn, s);

    }

}

/**
 * LocalActor represents an actor in the same address space as the running
 * script.
 *
 * This is the class client code would typically extend and utilize.
 */
export class LocalActor<M> {

    constructor(public context: LocalContext<M>) { }

    /**
     * run is called each time the actor is created.
     */
    run() { }

    /**
     * self returns the address of this actor.
     */
    self(): string {

        return this.context.path;

    }

    /**
     * spawn a new child actor using the passed template.
     */
    spawn(t: ActorConf<M>) {

        return this.context.spawn(t);

    }

    /**
     * tell sends a message to another actor within the system.
     *
     * The message is sent in a fire and forget fashion.
     */
    tell<M>(ref: string, m: M) {

        return this.context.tell(ref, m);

    }

    /**
     * ask is an alternative to tell that produces a Promise
     * that is only resolved when the destination sends us 
     * a reply.
     */
    ask<M>(ref: string, m: M) {

        return this.context.ask(ref, m);

    }

    /**
     * select selectively receives the next message in the mailbox.
     */
    select(c: Case<M>[]) {

        return this.context.select(c);

    }

    /**
     * receive the next message in this actor's mail queue using
     * the provided behaviour.
     */
    receive(f: (m: any) => void) {

        return this.context.receive(f);

    }

}


/**
 * ASEvent is the superclass of all events generated by
 * the system.
 */
export class ASEvent { }

/**
 * Logger is an interface for intercepting events generated
 * by the actor system.
 */
export interface Logger {

    info(e: ASEvent): void;
    warn(e: ASEvent): void;
    error(e: ASEvent): void;

}

/**
 * ChildSpawnedEvent 
 */
export class ChildSpawnedEvent extends ASEvent {

    constructor(public address: string) { super(); }

}

/**
 * MessageSentEvent 
 */
export class MessageSentEvent<M> extends ASEvent {

    constructor(public to: string, public from: string, public message: M) { super(); }

}

/**
 * MessageDroppedEvent 
 */
export class MessageDroppedEvent<M> extends MessageSentEvent<M>{ }

/**
 * MessageReceivedEvent 
 */
export class MessageReceivedEvent<M> extends MessageSentEvent<M>{ }

/**
 * ReceiveStartedEvent 
 */
export class ReceiveStartedEvent extends ASEvent {

    constructor(public path: string) { super(); }

}

/**
 * SelectStartedEvent 
 */
export class SelectStartedEvent extends ReceiveStartedEvent { }

export interface Configuration { log: LoggingPolicy }

export interface LoggingPolicy {

    level: number;
    logger: Logger;

}

/**
 * LoggingLogic contains the logic for system logging.
 */
export class LoggingLogic {

    constructor(public policy: LoggingPolicy) { }

    static createFrom(p: LoggingPolicy) {

        return new LoggingLogic(p);

    }

    /**
     * childSpawned 
     */
    childSpawned(ref: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new ChildSpawnedEvent(ref));

    }

    /**
     * messageDropped 
     */
    messageDropped<M>(m: Message<M>) {

        if (this.policy.level >= WARN)
            this.policy.logger.warn(new MessageDroppedEvent(m.to, m.from, m.message));

    }

    /**
     * messageSent 
     */
    messageSent<M>(m: Message<M>) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new MessageSentEvent(m.to, m.from, m.message));

    }

    /**
     * messageReceived 
     */
    messageReceived<M>(m: Message<M>) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new MessageReceivedEvent(m.to, m.from, m.message));

    }

    /**
     * receiveStarted 
     */
    receiveStarted(path: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new ReceiveStartedEvent(path));

    }

    /**
     * selectStarted 
     */
    selectStarted(path: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new SelectStartedEvent(path));

    }

}

const defaults = {
    log: { level: WARN, logger: console }
};

export interface ActorMap {

    [key: string]: Context<any>

}

/**
 * System is a system of actors.
 */
export class System {

    constructor(
        public config: Configuration = defaults,
        public actors: ActorMap = {},
        public logging: LoggingLogic = LoggingLogic.createFrom(config.log),
        public path = '') { }

    /**
     * create a new system
     */
    static create(c?: Configuration) {

        return new System(c);

    }

    /**
     * spawn a new top level actor within the system.
     */
    spawn(t: ActorConf<any>): System {

        this.putChild(t, this.path);
        return this;

    }

    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(t: ActorConf<any>, parent: string): string {

        var path = makeChildPath(t.id, parent); //@todo validate actor ids
        var child = t.create(path, this);

        if (this.actors.hasOwnProperty(path))
            throw new DuplicateActorPathError(path); //@todo use supervision instead

        this.actors[path] = child;
        this.logging.childSpawned(path);

        child.start();

        return path;

    }

    /**
     * dropMessage drops a message.
     */
    dropMessage<M>(m: Message<M>) {

        this.logging.messageDropped(m);

    }

    /**
     * putContext replaces an actor's context within the system.
     */
    putContext(path: string, context: Context<any>) {

        this.actors[path] = context;

    }

    /**
     * putMessage places a message into an actor's context.
     *
     * Messages are enveloped to help the system keep track of 
     * communication. The message may be processed or stored 
     * depending on the target actor's state at the time. 
     * If the target actor does not exist, the message is dropped.
     */
    putMessage<M>(to: string, from: string, message: M) {

        let actor = this.actors[to];
        let m = new Message(to, from, message);

        if (!actor) {
            this.dropMessage(m);
        } else {
            this.logging.messageSent(m);
            actor.feed(m);
        }

    }

    /**
     * askMessage allows an actor to ignore incomming messages unless
     * they have been sent by a specific actor.
     */
    askMessage<M>(to: string, from: string, m: M): Promise<M> {

        return new Promise((resolve: (m: M) => void) => {

            this.actors[from] = new PendingContext(to, this.actors[from], resolve, this);
            this.putMessage(to, from, m);

        });

    }

}

export const system = (c?: Configuration): System => System.create(c);

