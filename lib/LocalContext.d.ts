import { System } from './System';
import { Message } from './Message';
import { Template } from './Template';
import { Context } from './Context';
import { Behaviour } from './Behaviour';
import { LocalActor } from './LocalActor';
import { Case } from './Case';
/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
export declare class LocalContext extends Context {
    path: string;
    actorFn: (c: LocalContext) => LocalActor;
    system: System;
    behaviour: Behaviour;
    mailbox: Message<any>[];
    isClearing: boolean;
    constructor(path: string, actorFn: (c: LocalContext) => LocalActor, system: System, behaviour?: Behaviour, mailbox?: Message<any>[], isClearing?: boolean);
    _clear(): boolean;
    /**
     * setBehaviour changes the behaviour of the context.
     *
     * If a behaviour is already set, this method throws an Error
     */
    setBehaviour(b: Behaviour): LocalContext;
    spawn(t: Template): string;
    tell<M>(ref: string, m: M): void;
    ask<M, A>(ref: string, m: M): Promise<A>;
    select<T>(c: Case<T>[]): void;
    receive<M>(f: (m: M) => void): void;
    feed<M>(m: Message<M>): void;
    start(): void;
}
