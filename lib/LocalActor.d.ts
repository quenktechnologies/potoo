import { LocalContext } from './LocalContext';
import { Template as AbstractTemplate } from './Template';
import { Context } from './Context';
import { System } from './System';
import { Case } from './Case';
/**
 * Template is a template for creating a local actor.
 * @property {string} id
 * @property {function} start
 */
export declare class Template extends AbstractTemplate {
    id: string;
    actorFn: (c: LocalContext) => LocalActor;
    constructor(id: string, actorFn: (c: LocalContext) => LocalActor);
    /**
     * from constructs a new Template using the specified parameters.
     */
    static from(id: string, fn: (c: LocalContext) => LocalActor): Template;
    create(path: string, s: System): Context;
}
/**
 * LocalActor represents an actor in the same address space as the running
 * script.
 *
 * This is the class client code would typically extend and utilize.
 */
export declare class LocalActor {
    context: LocalContext;
    constructor(context: LocalContext);
    /**
     * run is called each time the actor is created.
     */
    run(): void;
    /**
     * self returns the address of this actor.
     */
    self(): string;
    /**
     * spawn a new child actor using the passed template.
     */
    spawn(t: Template): string;
    /**
     * tell sends a message to another actor within the system.
     *
     * The message is sent in a fire and forget fashion.
     */
    tell<M>(ref: string, m: M): void;
    /**
     * ask is an alternative to tell that produces a Promise
     * that is only resolved when the destination sends us
     * a reply.
     */
    ask<M>(ref: string, m: M): Promise<{}>;
    /**
     * select selectively receives the next message in the mailbox.
     */
    select<T>(c: Case<T>[]): void;
    /**
     * receive the next message in this actor's mail queue using
     * the provided behaviour.
     */
    receive<M>(f: (m: M) => void): void;
}
