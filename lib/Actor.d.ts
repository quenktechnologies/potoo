import * as Promise from 'bluebird';
import { System } from './System';
import { Case } from './Case';
export declare type Cases<T> = Case<T> | Case<T>[];
/**
 * Conf represents the minimum amount of information required to create
 * a new actor instance.
 */
export interface Conf {
    id: string;
    create(s: System): Actor;
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
export declare class Message {
    to: string;
    from: string;
    value: any;
    constructor(to: string, from: string, value: any);
}
export declare type ConsumeResult = Behaviour | null;
/**
 * Behaviour of a dynamic actor.
 */
export interface Behaviour {
    consume(m: Message): ConsumeResult;
}
/**
 * Receive
 */
export declare class Receive<T> {
    cases: Case<T>[];
    system: System;
    constructor(cases: Case<T>[], system: System);
    consume(m: Message): ConsumeResult;
}
/**
 * Select is for selective receives.
 */
export declare class Select<T> {
    cases: Case<T>[];
    system: System;
    constructor(cases: Case<T>[], system: System);
    consume(m: Message): ConsumeResult;
}
/**
 * Local are actors that directly exists in current memory.
 */
export declare abstract class Local implements Actor {
    __system: System;
    abstract run(_path: string): void;
    abstract accept(m: Message): void;
    constructor(__system: System);
    /**
     * self retrieves the path of this actor from the system.
     */
    self(): string;
    /**
     * spawn a new child actor.
     */
    spawn(t: Conf): void;
    /**
     * tell a message to an actor address.
     */
    tell(ref: string, m: any): void;
    /**
     * ask for a reply from a message sent to an address.
     */
    ask<R>(ref: string, m: any): Promise<R>;
}
/**
 * Static actors do not change their behaviour.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export declare abstract class Static<T> extends Local {
    abstract receive: Cases<T>;
    run(_path: string): void;
    accept(m: Message): void;
}
/**
 * Dynamic actors buffer messages allowing users to process messages when ready.
 */
export declare abstract class Dynamic extends Local {
    __mailbox: Message[];
    __behaviour: Behaviour;
    __consume(): void;
    select<T>(c: Cases<T>): void;
    receive<T>(c: Cases<T>): void;
    accept(m: Message): void;
    run(_path: string): void;
}
/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export declare class Pending<M> implements Actor {
    askee: string;
    original: Actor;
    resolve: (m: M) => void;
    system: System;
    constructor(askee: string, original: Actor, resolve: (m: M) => void, system: System);
    accept(m: Message): void;
    run(): void;
}
