import * as Promise from 'bluebird';
import { System } from './System';
import { Case, Cases } from './Case';

/**
 * Conf represents the minimum amount of information required to create
 * a new actor instance.
 */
export interface Conf {

    id: string;
    create(s: System, ...args: any[]): Actor

}

/**
 * Actor is the interface for actors.
 */
export interface Actor {

    accept(m: Message): void;
    run(path: string): void;

}

/**
 * Message is an envelope for user messages.
 */
export class Message {

    constructor(public to: string, public from: string, public value: any) { }

}

export type ConsumeResult
    = Behaviour
    | null
    ;

/**
 * Behaviour of a dynamic actor.
 */
export interface Behaviour {

    consume(m: Message): ConsumeResult;

}

/**
 * Receive 
 */
export class Receive<T> {

    constructor(public cases: Case<T>[], public system: System) { }

    consume(m: Message): ConsumeResult {

        if (this.cases.some(c => c.match(m.value))) {

            this.system.logging.messageReceived(m);

        } else {

            this.system.logging.messageDropped(m);

        }

        return this;

    }

}

/**
 * Select is for selective receives.
 */
export class Select<T> {

    constructor(public cases: Case<T>[], public system: System) { }

    consume(m: Message): ConsumeResult {

        if (this.cases.some(c => c.match(m.value))) {

            this.system.logging.messageReceived(m);
            return null;

        } else {

            this.system.logging.messageDropped(m);
            return this;

        }

    }

}

/**
 * Local are actors that directly exists in current memory.
 */
export abstract class Local implements Actor {

    abstract run(_path: string): void;

    abstract accept(m: Message): void;

    constructor(public __system: System) { }

    /**
     * self retrieves the path of this actor from the system.
     */
    self(): string {

        return this.__system.getPath(this);

    }

    /**
     * spawn a new child actor.
     */
    spawn(t: Conf, args?: any[]): string {

        return this.__system.putChild(t, this, args);

    }

    /**
     * tell a message to an actor address.
     */
    tell(ref: string, m: any): void {

        this.__system.putMessage(new Message(ref, this.self(), m));

    }

    /**
     * ask for a reply from a message sent to an address.
     */
    ask<R>(ref: string, m: any): Promise<R> {

        return this.__system.askMessage(new Message(ref, this.self(), m));

    }

}

/**
 * Static actors do not change their behaviour. 
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Static<T> extends Local {

    abstract receive: Cases<T>

    run(_path: string) { }

    accept(m: Message): void {

        let r = Array.isArray(this.receive) ? this.receive : [this.receive];

        if (!r.some(c => c.match(m.value)))
            this.__system.dropMessage(m);

    }

}

/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
export abstract class Dynamic extends Local {

    __mailbox: Message[] = [];

    __behaviour: Behaviour;

    __consume(): void {

        if (this.__mailbox.length === 0) return;

        if (!this.__behaviour) return;

        let m = this.__mailbox.shift();

        this.__behaviour = this.__behaviour.consume(m);

        this.__consume();

    }

    select<T>(c: Cases<T>): void {

        let cases = Array.isArray(c) ? c : [c];

        this.__behaviour = new Select(cases, this.__system);
        this.__system.logging.receiveStarted(this.__system.getPath(this));
        this.__consume();

    }

    receive<T>(c: Cases<T>) {

        let cases = Array.isArray(c) ? c : [c];

        this.__behaviour = new Receive(cases, this.__system);
        this.__system.logging.receiveStarted(this.__system.getPath(this));
        this.__consume();

    }

    accept(m: Message): void {

        this.__mailbox.push(m);
        this.__consume();

    }

    run(_path: string) { }

}

/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export class Pending<M> implements Actor {

    constructor(
        public askee: string,
        public original: Actor,
        public resolve: (m: M) => void,
        public system: System) { }

    accept(m: Message) {

        if (m.from !== this.askee) {

            this.system.dropMessage(m);

        } else {

            this.system.putActor(this.system.getPath(this), this.original);
            this.resolve(m.value);

        }

    }

    run() { }

}

export class Parent extends Local {

    accept(m: Message) {

        this.__system.dropMessage(m);

    }

    run() { }

}
