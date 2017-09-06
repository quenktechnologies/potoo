import * as Promise from 'bluebird';
import * as Events from './Events';
import * as Actor from './Actor';
import { DuplicateActorPathError } from './DuplicateActorPathError';

export const INFO = 6;
export const WARN = 5;
export const ERROR = 1;

/**
 * Configuration for the System
 */
export interface Configuration { log: LoggingPolicy }

/**
 * Logger is an interface for intercepting events generated
 * by the actor system.
 */
export interface Logger {

    info(e: Events.ASEvent): void;
    warn(e: Events.ASEvent): void;
    error(e: Events.ASEvent): void;

}

/**
 * LoggingPolicy sets what the system should log
 */
export interface LoggingPolicy {

    level: number;
    logger: Logger;

}

//defaults configuration
const defaults = {
    log: { level: WARN, logger: console }
};

/**
 * ContextMap a map of actor contexts.
 */
export interface ActorMap {

    [key: string]: Actor.Actor

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
            this.policy.logger.info(new Events.ChildSpawnedEvent(ref));

    }

    /**
     * messageDropped 
     */
    messageDropped(m: Actor.Message) {

        if (this.policy.level >= WARN)
            this.policy.logger.warn(new Events.MessageDroppedEvent(m.to, m.from, m.value));

    }

    /**
     * messageSent 
     */
    messageSent(m: Actor.Message) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new Events.MessageSentEvent(m.to, m.from, m.value));

    }

    /**
     * messageAccepted
     */
    messageAccepted(m: Actor.Message) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new Events.MessageAcceptedEvent(m.to, m.from, m.value));

    }

    /**
     * messageReceived 
     */
    messageReceived(m: Actor.Message) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new Events.MessageReceivedEvent(m.to, m.from, m.value));

    }

    /**
     * receiveStarted 
     */
    receiveStarted(path: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new Events.ReceiveStartedEvent(path));

    }

    /**
     * selectStarted 
     */
    selectStarted(path: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new Events.SelectStartedEvent(path));

    }

    /**
     * actorRemoved
     */
    actorRemoved(path: string, reason: number, asker: string) {

        if (reason !== 0) {
            if (this.policy.level >= ERROR)
                this.policy.logger.error(new Events.ActorRemovedEvent(path, reason, asker))
        } else if (this.policy.level >= WARN) {

            this.policy.logger.warn(new Events.ActorRemovedEvent(path, reason, asker))

        }

    }

}

const makeChildPath = (id: string, parent: string): string =>
    ((parent === '/') || (parent === '')) ? `${parent}${id}` : `${parent}/${id}`;

/**
 * System is a system of actors.
 */
export class System implements Actor.Actor {

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
     * getPath turns an actor into its path
     */
    getPath(a: Actor.Actor): string {

        if (a === this) return '';

        let hit = Object
            .keys(this.actors)
            .reduce((p, k) => (p != null) ? p : (this.actors[k] === a) ? k : null, null);

        if (hit == null)
            throw new Error(`System:Could not look up address of actor! ${a.constructor}`)

        return hit;

    }

    /**
     * spawn a new top level actor within the system.
     */
    spawn(t: Actor.Conf, args?: any[]): System {

        this.putChild(t, this, args);
        return this;

    }

    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(t: Actor.Conf, parent: Actor.Actor, args?: any[]): string {

        var path = makeChildPath(t.id, this.getPath(parent)); //@todo validate actor ids
        var child = args ? t.create.apply(null, [this].concat(args)) : t.create(this);

        if (this.actors.hasOwnProperty(path))
            throw new DuplicateActorPathError(path); //@todo use supervision instead

        this.actors[path] = child;
        this.logging.childSpawned(path);

        child.run(path);

        return path;

    }

    /**
     * dropMessage drops a message.
     */
    dropMessage(m: Actor.Message) {

        this.logging.messageDropped(m);

    }

    /**
     * putContext replaces an actor's context within the system.
     */
    putActor(path: string, actor: Actor.Actor) {

        this.actors[path] = actor;

    }

    /**
     * putMessage places a message into an actor's context.
     *
     * Messages are enveloped to help the system keep track of 
     * communication. The message may be processed or stored 
     * depending on the target actor's state at the time. 
     * If the target actor does not exist, the message is dropped.
     */
    putMessage(m: Actor.Message): void {

        let actor = this.actors[m.to];

        if (!actor) {
            this.dropMessage(m);
        } else {

            setTimeout(() => {
                this.logging.messageSent(m); actor.accept(m);
            }, 0);

        }

    }

    /**
     * askMessage allows an actor to ignore incomming messages unless
     * they have been sent by a specific actor.
     */
    askMessage<M>(m: Actor.Message): Promise<M> {

        return new Promise<M>((resolve, _) => {

            this.actors[m.from] = new Actor.Pending(m.to, this.actors[m.from], resolve, this);
            this.putMessage(m);

        });

    }

    /**
     * removeActor removes an actor from the system.
     * @todo should we require an actor be a child before removing?
     */
    removeActor(actor: string, reason: number, asker: string): void {

        this.actors = Object
            .keys(this.actors)
            .reduce((p: { [key: string]: Actor.Actor }, path) => {
                if (path === actor)
                    this.logging.actorRemoved(path, reason, asker);
                else
                    p[path] = this.actors[path];
                return p;

            }, {});

    }

    run() { }

    accept(m: Actor.Message) {

        this.dropMessage(m);

    }

}
