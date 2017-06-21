import { LocalContext } from './LocalContext';
import { Template as AbstractTemplate } from './Template';
import { Behaviour } from './Behaviour';
import { Context } from './Context';
import { System } from './System';

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
 * LocalActor
 */
export class LocalActor {

    constructor(public context: LocalContext) { }

    run() { }

    spawn(t: Template) {

        return this.context.spawn(t);

    }

    tell<M>(ref: string, m: M) {

        return this.context.tell(ref, m);

    }

    ask<M>(ref: string, m: M) {

        return this.context.ask(ref, m);

    }

    receive(b: Behaviour) {

        return this.context.receive(b);

    }

}
