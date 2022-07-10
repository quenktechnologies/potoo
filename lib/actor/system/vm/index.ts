import * as template from '../../template';
import * as errors from './runtime/error';
import * as events from './event';

import { Err } from '@quenk/noni/lib/control/error';
import {
    Future,
    pure,
    raise,
    batch,
    voidPure,
    doFuture,
    wrap
} from '@quenk/noni/lib/control/monad/future';
import { Maybe, nothing, just } from '@quenk/noni/lib/data/maybe'
import { isFunction } from '@quenk/noni/lib/data/type';
import { Either, left, right } from '@quenk/noni/lib/data/either';
import {
    distribute
} from '@quenk/noni/lib/data/array';
import {
    Record,
    merge,
    rmerge,
    mapTo,
    isRecord
} from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';

import {
    Address,
    isGroup,
    isRestricted,
    make,
    getParent,
    ADDRESS_SYSTEM,
    isChild
} from '../../address';
import { Template } from '../../template';
import { isRouter, isBuffered, FLAG_EXIT_AFTER_RUN, usesVMThread } from '../../flags';
import { Message, Envelope } from '../../message';
import { Instance, Actor } from '../../';
import { System } from '../';
import { SharedScheduler } from './thread/shared/scheduler';
import { SharedThread } from './thread/shared';
import { Thread, THREAD_STATE_IDLE, VMThread } from './thread';
import { Context, newContext } from './runtime/context';
import { Data } from './runtime/stack/frame';
import { Conf, defaults } from './conf';
import { LogWritable, LogWriter } from './log';
import { HeapLedger, DefaultHeapLedger } from './runtime/heap/ledger';
import { ScriptFactory } from './scripts/factory';
import { Foreign } from './type';
import { EventSource, Publisher } from './event';
import { GroupMap } from './groups';
import { ActorTable, ActorTableEntry } from './table';
import { RouterMap } from './routers';

const ID_RANDOM = `#?POTOORAND?#${Date.now()}`;

export const MAX_WORK_LOAD = 25;

/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends Actor {

    /**
     * heap storage with builtin ownership tracking for all threads.
     */
    heap: HeapLedger

    /**
     * log service for the VM.
     *
     * Used to access the internal logging API.
     */
    log: LogWritable

    /**
     * events service for the VM.
     *
     * Used to publish VM events to interested listeners.
     */
    events: EventSource

    /**
     * actors holds all the actors within the system at any given point along
     * with needed bookkeeping information.
     */
    actors: ActorTable

    /**
     * allocate a new Thread for an actor.
     *
     * It is an error if a Thread has already been allocated for the actor.
     */
    allocate(self: Address, t: template.Template): Either<Err, Address>

    /**
     * sendMessage to an actor in the system.
     *
     * The result is true if the actor was found or false
     * if the actor is not in the system.
     */
    sendMessage(to: Address, from: Address, msg: Message): boolean

    /**
     * spawn an actor using the given Instance as the parent.
     *
     * The Instance is required to verify if it is still part of the system.
     */
    spawn(parent: Instance, tmpl: template.Spawnable): Address

    /**
     * identify an actor Instance producing its address if it is part of the 
     * system.
     */
    identify(target: Instance): Maybe<Address>

    /**
     * kill terminates the actor at the specified address.
     *
     * The actor must be a child of parent to succeed.
     */
    kill(parent: Instance, target: Address): Future<void>

    /**
     * raise an exception within the system
     */
    raise(src: Instance, err: Err): void

    /**
     * exec a function by name with the provided arguments using the actor
     * instance's thread.
     */
    exec(actor: Instance, funName: string, args?: Data[]): void

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

    constructor(public system: System, public conf: Conf = defaults()) { }

    _actorIdCounter = -1;

    _context = newContext(this._actorIdCounter++, this, '$', {

        create: () => this,

        trap: () => template.ACTION_RAISE

    });

    /**
     * scheduler shared between vm threads.
     */
    scheduler = new SharedScheduler(this);

    heap = new DefaultHeapLedger();

    log = new LogWriter(this.conf.long_sink, this.conf.log_level);

    events = new Publisher(this.log);

    actors: ActorTable = new ActorTable({

        $: {

            context: this._context,

            thread: just(
                new SharedThread(
                    this,
                    ScriptFactory.getScript(this),
                    this.scheduler,
                    this._context))

        }

    });

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

    start() { }

    notify() { }

    stop(): Future<void> {

        return this.kill(this, ADDRESS_SYSTEM);

    }

    identify(inst: Instance): Maybe<Address> {

        return this.actors.addressFromActor(inst);

    }

    spawn(parent: Instance, tmpl: template.Spawnable): Address {

        let mparentAddr = this.identify(parent);

        if (mparentAddr.isNothing()) {

            this.raise(this, new errors.UnknownInstanceErr(parent));

            return '?';

        }

        return this._spawn(mparentAddr.get(), normalize(tmpl));

    }

    _spawn(parent: Address, tmpl: Template): Address {

        let eresult = this.allocate(parent, tmpl);

        if (eresult.isLeft()) {

            let mparentActor = this.actors.get(parent);

            if (mparentActor.isJust())
                this.raise(mparentActor.get().context.actor, eresult.takeLeft());

            return '?';

        }

        let result = eresult.takeRight();

        this.runActor(result);

        // TODO: Make this call stack friendly some day.
        if (Array.isArray(tmpl.children))
            tmpl.children.forEach(tmp => this._spawn(result, tmp));

        return result;

    }

    allocate(parent: Address, tmpl: Template): Either<Err, Address> {

        if (tmpl.id === ID_RANDOM) {

            let actor = this.actors.get(parent).get().context.actor;

            let prefix = actor.constructor.name.toLowerCase();

            tmpl.id = `actor::${this._actorIdCounter + 1}~${prefix}`;

        }

        if (isRestricted(<string>tmpl.id))
            return left(new errors.InvalidIdErr(<string>tmpl.id));

        let addr = make(parent, <string>tmpl.id);

        if (this.actors.has(addr))
            return left(new errors.DuplicateAddressErr(addr));

        let args = Array.isArray(tmpl.args) ? tmpl.args : [];

        let actor = tmpl.create(this.system, tmpl, ...args);

        let context = actor.init(newContext(
            this._actorIdCounter++, actor, addr, tmpl));

        let thread: Maybe<Thread> = usesVMThread(context.flags) ?
            just(new SharedThread(
                this,
                ScriptFactory.getScript(actor),
                this.scheduler,
                context
            )) : nothing();

        this.actors.set(addr, { thread, context });

        this.events.publish(addr, events.EVENT_ACTOR_CREATED);

        if (isRouter(context.flags)) this.routers.set(addr, addr);

        if (tmpl.group) {

            let groups = Array.isArray(tmpl.group) ? tmpl.group : [tmpl.group];

            groups.forEach(group => this.groups.put(group, addr));

        }

        return right(addr);

    }

    runActor(target: Address) {

        if (!this.actors.has(target))
            return raise(new errors.UnknownAddressErr(target));

        let ate = this.actors.get(target).get();

        let ft = ate.context.actor.start(target);

        if (ft) {

            // Assumes the actor returned a Future.

            if (ate.thread.isNothing()) {

                ft.fork(e => this.raise(ate.context.actor, e));

            } else {

                let thread = ate.thread.get();

                if (ft) thread.wait(ft);

                // Actors with this flag need to be brought down immediately.
                // TODO: Move this to the actors own run method after #47
                if (ate.context.flags & FLAG_EXIT_AFTER_RUN)
                    thread.wait(this.kill(ate.context.actor, target));

            }

        }

        this.events.publish(ate.context.address, events.EVENT_ACTOR_STARTED);

    }

    sendMessage(to: Address, from: Address, msg: Message): boolean {

        this.events.publish(from, events.EVENT_SEND_START, to, from, msg);

        let mRouter = this.routers.getFor(to)
            .chain(addr => this.actors.get(addr))
            .map(ate => ate.context);

        let mctx = mRouter.isJust() ?
            mRouter :
            this.actors.get(to).map(ate => ate.context)

        //routers receive enveloped messages.
        let actualMessage = mRouter.isJust() ?
            new Envelope(to, from, msg) : msg;

        if (mctx.isJust()) {

            let ctx = mctx.get();

            if (isBuffered(ctx.flags)) {

                ctx.mailbox.push(actualMessage);

                ctx.actor.notify();

            } else {

                // TODO: Support async.
                ctx.actor.accept(actualMessage);

            }

            this.events.publish(from, events.EVENT_SEND_OK, to, msg);

            return true;

        } else {

            this.events.publish(from, events.EVENT_SEND_FAILED, to, msg);

            return false;

        }

    }

    raise(src: Instance, err: Err): void {

        let maddr = this.identify(src);

        // For now, ignore requests from unknown instances.
        if (maddr.isNothing()) return;

        let addr = maddr.get();

        //TODO: pause the thread if one is used.
        let next = addr;

        loop:
        while (true) {

            let mate = this.actors.get(next);

            //TODO: This risks swallowing errors.
            if (mate.isNothing()) return;

            let ate = mate.get();

            let trap = ate.context.template.trap ||
                (() => template.ACTION_RAISE);

            switch (trap(err)) {

                case template.ACTION_IGNORE:
                    // TODO: do this via a method.
                    ate.thread.map(thr => {
                        thr.state = THREAD_STATE_IDLE
                    });
                    break loop;

                case template.ACTION_RESTART:

                    let mate = this.actors.get(next);

                    if (mate.isJust())
                        this
                            .kill(mate.get().context.actor, next)
                            .chain(() => {

                                let eRes = this.allocate(getParent(next),
                                    ate.context.template);

                                if (eRes.isLeft())
                                    return raise(new Error(
                                        eRes.takeLeft().message));

                                this.runActor(eRes.takeRight());

                                return voidPure;

                            }).fork(e => this.raise(this, e));
                    break loop;

                case template.ACTION_STOP:

                    let smate = this.actors.get(next);

                    if (smate.isJust())
                        this.kill(smate.get().context.actor, next)
                            .fork(e => this.raise(this, e));
                    break loop;

                default:
                    if (next === ADDRESS_SYSTEM) {

                        if (err instanceof Error) throw err;

                        throw new Error(err.message);

                    } else {

                        next = getParent(next);

                    }

                    break;

            }

        }

    }

    kill(parent: Instance, target: Address): Future<void> {

        let that = this;

        return doFuture<void>(function*() {

            let mparentAddr = that.identify(parent);

            // For now, ignore unknown kill requests.
            if (mparentAddr.isNothing()) return pure(undefined);

            let parentAddr = mparentAddr.get();

            let targets = isGroup(target) ?
                that.groups.get(target).orJust(() => []).get() : [target];

            return runBatch(targets.map((next: Address) =>
                doFuture<void>(function*() {

                    if ((!isChild(parentAddr, target)) &&
                        (target !== parentAddr)) {

                        let err = new Error(
                            `IllegalStopErr: Actor "${parentAddr}" ` +
                            `cannot kill non-child "${next}"!`);

                        that.raise(parent, err);

                        return raise<void>(err);

                    }

                    let mentry = that.actors.get(next);

                    if (mentry.isNothing()) return pure(<void>undefined);

                    let killChild = (ate: ActorTableEntry) =>
                        doFuture(function*() {

                            if (ate.thread.isJust())
                                // The thread will clean up.
                                yield ate.thread.get().die();
                            else
                                yield wrap(ate.context.actor.stop());

                            let { address } = ate.context;

                            that.actors.remove(address);

                            that.events.publish(address,
                                events.EVENT_ACTOR_STOPPED);

                            return voidPure;

                        });

                    yield runBatch(that.actors.getChildren(next)
                        .reverse().map(killChild));

                    if (next !== ADDRESS_SYSTEM)
                        yield killChild(mentry.get());

                    return voidPure;

                })));

        });

    }

    /**
     * tell allows the vm to send a message to another actor via opcodes.
     *
     * If you want to immediately deliver a message, use [[sendMessage]] instead.
     */
    tell<M>(ref: Address, msg: M): PVM {

        this.exec(this, 'tell', [this.heap.string(ref), this.heap.object(msg)]);

        return this;

    }

    exec(actor: Instance, funName: string, args: Foreign[] = []) {

        let thread: VMThread;

        if (actor === this) {

            thread = <VMThread>this.actors.getThread('$').get();

        } else {

            let mAddress = this.identify(actor);

            if (mAddress.isNothing())
                return this.raise(this, new errors.UnknownInstanceErr(actor));

            thread = <VMThread>this.actors.getThread(mAddress.get()).get();

        }

        thread.exec(funName, args);

    }

}

const runBatch = (work: Future<void>[]): Future<void> =>
    doFuture(function*() {

        yield batch(distribute(work, MAX_WORK_LOAD))

        return voidPure;

    });

const normalize = (spawnable: template.Spawnable) => {

    let tmpl = <Partial<Template>>(isFunction(spawnable) ?
        { create: spawnable } :
        spawnable);

    tmpl.id = tmpl.id ? tmpl.id : ID_RANDOM

    return <Template>merge(tmpl, {

        children: isRecord(tmpl.children) ?
            mapTo(tmpl.children, (c, k) => merge(c, { id: k })) :
            tmpl.children ? tmpl.children : []

    })

}
