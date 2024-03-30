import * as template from '../../template';
import * as errors from './runtime/error';
import * as events from './event';

import { Err, Except } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Either } from '@quenk/noni/lib/data/either';
import { isFunction, Type } from '@quenk/noni/lib/data/type';
import { distribute, empty } from '@quenk/noni/lib/data/array';
import {
    Record,
    merge,
    rmerge,
    mapTo,
    isRecord
} from '@quenk/noni/lib/data/record';

import {
    Address,
    isGroup,
    isRestricted,
    make,
    ADDRESS_SYSTEM,
    isChild
} from '../../address';
import { Template } from '../../template';
import { isRouter } from '../../flags';
import { Message, Envelope } from '../../message';
import { Actor } from '../../';
import { System } from '../';
import { SharedThread } from './thread/shared';
import { Thread, THREAD_STATE_IDLE } from './thread';
import { Context, newContext } from './runtime/context';
import { Conf, defaults } from './conf';
import { LogWritable, LogWriter } from './log';
import { ScriptFactory } from './scripts/factory';
import { EventSource, Publisher } from './event';
import { GroupMap } from './groups';
import { ActorTable, ActorTableEntry } from './table';
import { RouterMap } from './routers';
import { Scheduler } from './scheduler';
import { RegistrySet } from './registry';

const ID_RANDOM = `#?POTOORAND?#${Date.now()}`;

export const MAX_WORKLOAD = 25;

/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends Actor {
    /**
     * log service for the VM.
     *
     * Used to access the internal logging API.
     */
    log: LogWritable;

    /**
     * events service for the VM.
     *
     * Used to publish VM events to interested listeners.
     */
    events: EventSource;

    /**
     * actors holds all the actors within the system at any given point along
     * with needed bookkeeping information.
     */
    actors: ActorTable;

    /**
     * scheduler used to manage the execution of VM threads.
     */
    scheduler: Scheduler;

    /**
     * registry for VM objects.
     */
    registry: RegistrySet;

    /**
     * allocate resources for an actor using the template provided.
     */
    allocate(parent: Thread, tmpl: template.Template): Except<Address>;

    /**
     * sendMessage to an actor in the system.
     */
    sendMessage(from: Thread, to: Address, msg: Message): void;

    /**
     * spawn an top level actor using the system as its parent.
     */
    spawn(tmpl: template.Spawnable): Future<Address>;

    /**
     * kill terminates the actor at the specified address.
     *
     * The actor must be a child of parent to succeed.
     */
    kill(src: Thread, target: Address): Future<void>;

    /**
     * raise an exception within the system
     */
    raise(src: Thread, err: Err): Future<void>;
}

/**
 * PVM (Potoo Virtual Machine) is a JavaScript implemented virtual machine that
 * functions as a message delivery system between target actors.
 *
 * Actors known to the VM are considered to be part of a system and may or may
 * not reside on the same process/worker/thread depending on the underlying
 * platform and individual actor implementations.
 */
export class PVM implements Platform {
    constructor(
        public system: System,
        public conf: Conf = defaults()
    ) {}

    _actorIdCounter = -1;

    log = new LogWriter(this.conf.long_sink, this.conf.log_level);

    scheduler = new Scheduler();

    registry = new RegistrySet();

    events = new Publisher(this.log);

    actors: ActorTable = new ActorTable(
        new Map([
            [
                ADDRESS_SYSTEM,
                {
                    actor: this,

                    thread: new SharedThread(
                        this,
                        ScriptFactory.getScript(),
                        newContext(this._actorIdCounter++, '$', {
                            create: () => this,

                            trap: () => template.ACTION_RAISE
                        })
                    )
                }
            ]
        ])
    );

    /**
     * routers configured to handle any address that falls underneath them.
     */
    routers = new RouterMap();

    /**
     * groups combine multiple addresses into one.
     */
    groups = new GroupMap();

    /**
     * Create a new PVM instance using the provided System implementation and
     * configuration object.
     */
    static create<S extends System>(s: S, conf: object = {}): PVM {
        return new PVM(s, <Conf>rmerge(<Record<Type>>defaults(), <any>conf));
    }

    init(c: Context): Context {
        return c;
    }

    accept(m: Message) {
        return this.conf.accept(m);
    }

    async start() {}

    notify() {}

    async stop() {}

    spawn(tmpl: template.Spawnable): Future<Address> {
        return Future.do(async () => {
            let eresult = this.allocate(
                this.actors.getThread('$').get(),
                normalize(tmpl)
            );
            return eresult.isLeft()
                ? Future.raise(eresult.takeLeft())
                : Future.of(eresult.takeRight());
        });
    }

    allocate(parent: Thread, tmpl: Template): Except<Address> {
        let mparentEntry = this.actors.get(parent.context.address);

        if (mparentEntry.isNothing())
            return Either.left(new errors.InvalidThreadErr(parent));

        let parentEntry = mparentEntry.get();

        if (parent !== parentEntry.thread)
            return Either.left(new errors.InvalidThreadErr(parent));

        let prefix = parentEntry.actor.constructor.name.toLowerCase();

        let id = tmpl.id || `actor::${this._actorIdCounter + 1}~${prefix}`;

        if (isRestricted(<string>id))
            return Either.left(new errors.InvalidIdErr(id));

        let addr = make(parent.context.address, id);

        if (this.actors.has(addr))
            return Either.left(new errors.DuplicateAddressErr(addr));

        let context = newContext(this._actorIdCounter++, addr, tmpl);

        let thread = new SharedThread(this, ScriptFactory.getScript(), context);

        let actor = tmpl.create(thread);

        this.actors.set(addr, { thread, actor });

        //TODO: this.events.actor.onCreated.dispatch(addr)
        this.events.publish(addr, events.EVENT_ACTOR_CREATED);

        if (isRouter(thread.context.flags)) this.routers.set(addr, addr);

        if (tmpl.group) {
            let groups = Array.isArray(tmpl.group) ? tmpl.group : [tmpl.group];

            groups.forEach(group => this.groups.put(group, addr));
        }

        thread.watch(() => actor.start());

        return Either.right(addr);
    }

    sendMessage(from: Thread, to: Address, msg: Message) {
        //TODO: this.events.actor.onSend.dispatch(from.context.address, to, msg);
        this.events.publish(
            from.context.address,
            events.EVENT_SEND_START,
            to,
            from,
            msg
        );

        let mRouter = this.routers
            .getFor(to)
            .chain(addr => this.actors.get(addr));

        let mentry = mRouter.isJust() ? mRouter : this.actors.get(to);

        //routers receive enveloped messages.
        let actualMessage = mRouter.isJust()
            ? new Envelope(from.context.address, to, msg)
            : msg;

        if (mentry.isNothing()) {
            //TODO: this.events.actor.onSendFailed.dispatch(from.context.address, to, msg);
            this.events.publish(
                from.context.address,
                events.EVENT_SEND_FAILED,
                to,
                msg
            );
        }

        let { thread } = mentry.get();

        thread.context.mailbox.push(actualMessage);
        thread.notify(actualMessage);

        //TODO: this.events.actor.onSendOk.dispatch(from.context.address, to, msg);
        this.events.publish(
            from.context.address,
            events.EVENT_SEND_OK,
            to,
            msg
        );
    }

    raise(src: Thread, err: Err): Future<void> {
        return Future.do(async () => {
            let currentThread = src;

            loop: while (true) {
                let mparent = this.actors
                    .getParent(currentThread.context.address)
                    .map(entry => entry.thread);

                let trap = currentThread.context.template.trap || defaultTrap;

                switch (trap(err)) {
                    case template.ACTION_IGNORE:
                        // TODO: do this via a method.
                        currentThread.state = THREAD_STATE_IDLE;
                        break loop;

                    case template.ACTION_RESTART:
                        await this.kill(
                            currentThread,
                            currentThread.context.address
                        );
                        if (mparent.isNothing()) return;
                        this.allocate(
                            mparent.get(),
                            currentThread.context.template
                        );
                        break loop;

                    case template.ACTION_STOP:
                        await this.kill(
                            currentThread,
                            currentThread.context.address
                        );
                        break loop;

                    default:
                        if (currentThread.context.address === ADDRESS_SYSTEM) {
                            let action = this.conf.trap(err);

                            if (action === template.ACTION_IGNORE) break loop;

                            if (err instanceof Error) throw err;

                            throw new Error(err.message);
                        }

                        if (mparent.isNothing()) return; // parent is dead.

                        currentThread = mparent.get();
                        break loop;
                }
            }
        });
    }

    kill(src: Thread, target: Address): Future<void> {
        return Future.do(async () => {
            let rootAddresses = isGroup(target)
                ? this.groups.get(target)
                : [target];

            let roots = [];
            for (let addr of rootAddresses) {
                let mentry = this.actors.get(addr);
                if (!isChild(src.context.address, addr)) {
                    return Future.raise(
                        new errors.IllegalStopErr(src.context.address, addr)
                    );
                }
                if (mentry.isJust()) {
                    roots.push(mentry.get());
                }
            }

            let targets = [];

            while (!empty(roots)) {
                let next = <ActorTableEntry>roots.pop();
                roots = [
                    ...roots,
                    this.actors.getChildren(next.thread.context.address)
                ];
                targets.push(next);
            }

            await Future.batch(
                distribute(
                    targets.map(target => {
                        let { thread, actor } = target;

                        //XXX: This is done now to prevent the thread from
                        // executing any more jobs.
                        thread.die();

                        return Future.do(async () => {
                            // TODO: Consider catching any error here and
                            // escalating to the iniator of the kill.
                            await actor.stop();

                            this.actors.remove(target.thread.context.address);

                            // TODO: dispatch event
                            this.events.publish(
                                target.thread.context.address,
                                events.EVENT_ACTOR_STOPPED
                            );
                        });
                    }),
                    MAX_WORKLOAD
                )
            );
        });
    }

    /**
     * tell allows the VM to send a message to actors within the system.
     *
     * This delivers the message immediately to the actor and should not be used
     * for regular communication. Instead use it to send messages from external
     * operations such as event handlers etc.
     */
    tell<M>(to: Address, msg: M) {
        this.sendMessage(this.actors.items.get('$'), to, msg);
    }
}

const normalize = (spawnable: template.Spawnable) => {
    let tmpl = <Partial<Template>>(
        (isFunction(spawnable) ? { create: spawnable } : spawnable)
    );

    tmpl.id = tmpl.id ? tmpl.id : ID_RANDOM;

    return <Template>merge(tmpl, {
        children: isRecord(tmpl.children)
            ? mapTo(tmpl.children, (c, k) => merge(c, { id: k }))
            : tmpl.children
              ? tmpl.children
              : []
    });
};

const defaultTrap = () => template.ACTION_RAISE;
