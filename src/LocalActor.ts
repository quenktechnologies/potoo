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
export class Template extends AbstractTemplate {

    constructor(public id: string, public actorFn: (c: LocalContext) => LocalActor) {

        super(id);

    }

    /**
     * from constructs a new Template using the specified parameters.
     */
    static from(id: string, fn: (c: LocalContext) => LocalActor) {

        return new Template(id, fn);

    }

    create(path: string, s: System): Context {

        return new LocalContext(path, this.actorFn, s);

    }

}

/**
 * LocalActor represents an actor in the same address space as the running
 * script.
 *
 * This is the class client code would typically extend and utilize.
 */
export class LocalActor {

    constructor(public context: LocalContext) { }

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
    spawn(t: Template) {

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
    select<T>(c: Case<T>[]) {

        return this.context.select(c);

    }

    /**
     * receive the next message in this actor's mail queue using
     * the provided behaviour.
     */
    receive<M>(f: (m: M) => void) {

        return this.context.receive(f);

    }

}
