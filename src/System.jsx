import beof from 'beof';
import { IO } from './monad';

/**
 *
 * @typedef TakePair
 * @property {Array<function<} tasks
 * @property {Array<Context>} actors
 */

/**
 * Top
 * @property {Array<Node>} children
 */
export class Top {

    constructor(children = []) {

        this.children = children;

    }

}

/**
 * Node is a data structure we use to record the hierachy of the actor system.
 *
 * Rather than store the nodes in here, we store the ids with information about
 * the index, parent and child.
 * @property {number} index
 * @property {string} parent
 * @property {Array<string>} children
 */
class Node {

    constructor(index, parent, children) {

        this.index = beof({ index }).optional().number().value;
        this.parent = beof({ parent }).optional().instance(Node).value;
        this.children = beof({ children }).array().value;

    }

}

/**
 * Template is an abstract type that represents information for creating an actor.
 */
export class Template {

}

/**
 * EventTemplate is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Context →  Context
 */
export class EventTemplate extends Template {

    constructor(id, start) {

        super();
        this.id = id;
        this.start = start;

    }

}

/**
 * Context
 */
export class Context {

    constructor(path, tasks = []) {

        this.path = path;
        this.tasks = tasks;

    }

    /**
     * spawn
     */
    spawn(t) {

        return new Context(this.path,
            this.tasks.concat(
                sys => new System(
                    sys.actors.concat(t.start(
                        new Context(`{this.path}/${t.id}`))), [])));

    }

    /**
     * schedule tasks within a System
     * @summary {System} →  {System}
     */
    schedule(s) {

        return new System(
            replace(new Context(this.path), this.actors),
            s.tasks.concat(this.tasks));

    }

}

/**
 * replace a Context within a list of Contexts with a new version.
 * @summary (Context,Array<Context>) →  Array<Context>
 */
export const replace = (a, c) =>
    a.map(a => (a.path === c.path) ? c : a);

/**
 * System implementations are the system part of the actor model¹.
 *
 * A System is effectively a mesh network where any node can
 * communicate with another provided they have an unforgable address for that node
 * (and are allowed to).
 *
 * Previously this was tackled as a class whose reference was shared between the
 * child actors' contexts. Now we still take a simillar approach
 * but instead of being a singleton the System's implementation is influenced by Monads.
 *
 * We also intend to unify actors that run on seperate threads/process with ones on the
 * main loop thus eliminating the need for an environment specific System.
 *
 * ¹ https://en.wikipedia.org/wiki/Actor_model
 */
export class System {

    constructor(actors = [], tasks = []) {

        this.actors = actors;
        this.tasks = tasks;

    }

    /**
     * spawn a new actor.
     *
     * The actor will be spawned on the next turn of the event loop.
     * @summary Template →  System
     */
    spawn(t) {

        return new System(this.actors,
            this.tasks.concat(
                sys => new System(
                    sys.actors.concat(t.start(new Context(t.id, this, []))), [])));

    }


    /**
     * schedule the side effects of this system.
     * @summary () →  IO
     */
    schedule() {

        IO.of(this.actors.reduce((s, a) => a.schedule(s), this))
            .chain(sys => sys.tasks.reduce((io, t) => io.map(t), IO.of(sys)))
            .chain(sys => IO.of(() => setTimeout(() => sys.schedule().run(), 0)));

    }

}

export default System
