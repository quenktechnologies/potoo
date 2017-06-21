import { System } from './System';
import { Message } from './Message';
import { Template } from './Template';
import { Context } from './Context';
import { Behaviour } from './Behaviour';
import { Receiver } from './Receiver';
import { LocalActor } from './LocalActor';
/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
export declare class LocalContext extends Context {
    path: string;
    actorFn: (c: LocalContext) => LocalActor;
    system: System;
    receiver: Receiver;
    mailbox: any[];
    constructor(path: string, actorFn: (c: LocalContext) => LocalActor, system: System, receiver?: Receiver, mailbox?: any[]);
    spawn(t: Template): string;
    tell<M>(ref: string, m: M): void;
    ask<M, A>(ref: string, m: M): Promise<A>;
    receive(b: Behaviour): void;
    feed<M>(m: Message<M>): void;
    start(): void;
}
