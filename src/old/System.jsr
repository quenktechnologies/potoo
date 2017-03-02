import beof from 'beof';
import { match } from './Match';
import { IO, left, right } from './monad';
import { Actor, ActorT } from './Actor';
import { Spawn, Tell, Kill, Drop, Receive } from './Message';
import { merge } from './util';

/**
 * Stopped is used to represent the System that has been stopped (killed)
 * it can not be restarted.
 * @property {() →  IO} io
 */
export class Stopped {

    constructor(io = IO.of(null)) {

        this.io = io;

    }

    spawn() {

        return this;

    }

    tick() {

        return this;

    }

    tock() {

        return this.io.run();

    }

    start() {

        return this.tick().tock();

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
 * @property {Object<string, Actor>} actors
 * @property {Object<string,Array>} mailboxes
 * @property {Array<Task>} tasks
 * @property {Array<System →  IO<System>>} io
 */
export class System {

    constructor(actors = {}, mailboxes = { '$': [] }, tasks = [], io = []) {

        beof({ actors }).object();
        beof({ mailboxes }).object();
        beof({ tasks }).array();
        beof({ io }).array();

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
            this.tasks.concat(new Spawn({ parent: '', template })),
            this.io);

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
     * @summary System => (System →  IO<System>) →  null
     */
    tock(f) {

        beof({ f }).function();

        return this
            .io
            .reduce((io, f) => io.chain(f), IO.of(this))
            .chain(f)
            .run();

    }

    start() {

        return this.tick().tock(s => IO.of(() => setTimeout(() => s.start, 0)));

    }

}

/**
 * scheduleActors
 * @summary System →  System
 */
export const scheduleActors = s =>
    Object.keys(s.actors).reduce((s, k) => s.actors[k].schedule(s), s);

/**
 * processSysQ executes a task from the system queue (FIFO)
 * @summary System →  Either<System,System>
 */
export const processSysQ = s =>
    ((s.mailboxes.$[0] == null) ? left(s) : right(s.mailboxes.$[0]))
    .chain(m =>
        match(m)
        .caseOf(Kill, kill(s))
        .end(left, right))
    .map(s => console.log(s) || copy(s, {
        mailboxes: merge(s.mailboxes, { $: s.mailboxes.$.slice(1) })
    }))

/**
 * kill
 * @summary System →  Kill →  Stopped
 */
export const kill = () => () =>
    new Stopped(() => console.warn('System is going down!'));

/**
 * processUserQ
 * @summary System →  System
 */
export const processUserQ = s => s.tasks.reduce((s, t) =>
    match(t)
    .caseOf(Spawn, createActor(s))
    .caseOf(Tell, deliver(s))
    .end(() => s, s => s), s)

/**
 * createActor
 * @summary System →  Spawn →  System
 */
export const createActor = s => ({ template, parent }) =>
    new System(
        merge(s.actors, {

                [address(parent, template.id)]: template
                    .start(new Actor(address(parent, template.id)))

            },
            merge(s.mailboxes, {

                [address(parent, template.id)]: []

            }),
            s.tasks, s.io));

/**
 * deliver puts messages in their respective mailboxes.
 * @summary System →  Tell →  System
 */
export const deliver = s => ({ to, from, message }) =>
    match(s.mailboxes[to])
    .caseOf(Array, box => copy(s, {
        mailboxes: merge(s.mailboxes, {
            [to]: box.concat(message)
        })
    }))
    .caseOf(Function, f => copy(s, { io: s.io.concat(s => f(message, s)) }))
    .caseOf(null, copy(s, {
        mailboxes: s.mailboxes.$.concat(new Drop({ to, from, message }))
    }))
    .end(s => s, s => s)

/**
 * copy a System replacing desired keys
 * @summary (System, Object) →  System
 */
export const copy = (s, o) => {

    beof({ s }).instance(System);

    return new System(
        o.actors || s.actors,
        o.mailboxes || s.mailboxes,
        o.tasks || s.tasks,
        o.io || s.io);

}

/**
 * address forms the address path of an Actor
 * @summary (string,string) →  string
 */
export const address = (parent, id) => `${parent}/${id}`;
