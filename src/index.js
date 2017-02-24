import beof from 'beof';
import { IO, left, right, Maybe } from './monad';
import { match } from './Match';

/**
 * Message copies the enumerable properties of an object and assigns them to itself.
 *
 * This class can be used to create adhoc type hiearchies for your code bases messages.
 * @param {object} src
 */
export class Message {

    constructor(src = {}) {

        Object.keys(src).forEach(k => this[k] = src[k]);

    }

}

/**
 * Task
 */
export class Task extends Message {}

/**
 * Spawn
 * @property {string} parent
 * @property {ActorT} template
 */
export class Spawn extends Task {}

/**
 * Tell
 * @property {string} to
 * @property {*} message
 */
export class Tell {

    constructor(to, message) {

        this.to = to
        this.message = message;

    }

}

/**
 * Kill an Actor
 */
export class Kill {}

/**
 * Receive
 * @property {string} path
 * @property {Behaviour} behaviour
 */
export class Receive {

    constructor(path, behaviour) {

        this.path = path;
        this.behaviour = behaviour;

    }

}

/**
 * ActorT is a template for creating actors that run in
 * the same event loop as the system.
 * @property {string} id - must be unique
 * @property {function} start - Context →  Context
 */
export class ActorT {

    constructor(id, start) {

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
    spawn(template) {

        beof({ template }).instance(ActorT);

        return new Context(this.path,
            this.tasks.concat(new Spawn({ parent: this.path, template })));

    }

    /**
     * tell sends a message to another actor within the system.
     * @summary (string,*) →  Context
     */
    tell(s, m) {

        beof({ s }).string();

        return new Context(this.path, this.tasks.concat(new Tell(s, m)));

    }

    /**
     * schedule tasks within a System
     * @summary {System} →  {System}
     */
    schedule(s) {

        beof({ s }).instance(System);

        return new System(
            replaceActor(new Context(this.path, []), s.actors),
            s.mailboxes,
            s.tasks.concat(this.tasks),
            s.io);

    }

}

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

    constructor(actors = [], mailboxes = { '$': [] }, tasks = [], io = IO.of(null)) {

        beof({ actors }).array();
        beof({ mailboxes }).object();
        beof({ tasks }).array();
        beof({ io }).instance(IO);

        this.actors = actors;
        this.mailboxes = mailboxes;
        this.tasks = tasks;
        this.io = io;

    }

    /**
     * spawn a new actor.
     *
     * The actor will be spawned on the next turn of the event loop.
     * @summary ActorT →  System
     */
    spawn(template) {

        beof({ template }).instance(ActorT);

        return new System(
            this.actors,
            this.mailboxes,
            this.tasks.concat(new Spawn({ parent: '', template })), this.io);

    }

    /**
     * tick
     * @summary System => System
     */
    tick() {

        return processSysQ(scheduleActors(this)).cata(processUserQ, s => s);

    }

    /**
     * tock
     * (performs side effects immediately)
     * @summary System => (System →  System) →  IO<null>
     */
    tock(f) {

        beof({ f }).function();

        return this.io.chain(s => (s == null) ? IO.of(null) : IO.of(() => f(s))).run();

    }

    start() {

        return this.tick().tock(s => IO.of(() => setTimeout(() => s.start, 0)));

    }

}

/**
 * scheduleActors
 * @summary System →  System
 */
export const scheduleActors = s => s.actors.reduce((s, a) => a.schedule(s), s);

/**
 * processSysQ
 * @summary System →  Either<System,System>
 */
export const processSysQ = s =>
    ((s.mailboxes.$[0] == null) ? left(s) : right(s.mailboxes.$[0]))
    .map(m =>
        match(m)
        .caseOf(Kill, () => kill(s))
        .end(left, right));

/**
 * kill
 * @summary System →  Kill → System
 */
export const kill = () => () =>
    new System([], {}, [],
        IO.of(() => console.warn('System is going down!')));

/**
 * processUserQ
 * @summary System →  System
 */
export const processUserQ = s =>
    s.tasks.reduce(userDQ, s);

/**
 * userDQ handles a task generated by the user level
 * @summary (System, Task) →  System
 */
export const userDQ = (s, t) =>
    match(t)
    .caseOf(Spawn, createActor(s))
    .caseOf(Tell, deliver(s))
    .end(t=>t, t=>t);

/**
 * createActor
 * @summary System →  Spawn →  IO<System>
 */
export const createActor = s => ({ template, parent }) =>
    new System(
        s.actors.concat(template.start(new Context(`${parent}/${template.id}`))),
        merge(s.mailboxes, {
            [`${parent.path}/${template.id}`]: []
        }),
        s.tasks, s.io);

/**
 * deliver puts messages in their respective mailboxes.
 * @summary System →  Tell →  IO<System>
 */
export const deliver = s => ({ to, message }) =>
    Maybe
    .not(s.mailboxes[to])
    .map(box => merge(s.mailboxes, {
        [to]: box.concat(message)
    }))
    .map(boxes => new System(s.actors, boxes, s.tasks, s.io));

/**
 * replaceActor replaces a Context within a list of Contexts with a new version.
 * @summary (Context,Array<Context>) →  Array<Context>
 */
export const replaceActor = (a, c) =>
    a.map(a => (a.path === c.path) ? c : a);

/**
 * merge two objects easily
 * @summary (Object, Object) →  Object
 */
export const merge = (o1, o2) => Object.assign({}, o1, o2);
