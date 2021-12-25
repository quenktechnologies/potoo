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
    doFuture
} from '@quenk/noni/lib/control/monad/future';
import { Maybe, fromNullable } from '@quenk/noni/lib/data/maybe'
import { isFunction } from '@quenk/noni/lib/data/type';
import { Either, left, right } from '@quenk/noni/lib/data/either';
import {
    distribute
} from '@quenk/noni/lib/data/array';
import {
    Record,
    map,
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
import { isRouter, isBuffered } from '../../flags';
import { Message, Envelope } from '../../message';
import { Instance, Actor } from '../../';
import { System } from '../';
import { SharedThreadRunner } from './thread/shared/runner';
import { SharedThread } from './thread/shared';
import { Thread, VMThread } from './thread';
import {
    State,
    get,
    put,
    putRoute,
    putMember,
    removeRoute,
    getRouter,
    getGroup,
    getChildren,
    remove,
    Threads,
    getAddress
} from './state';
import { Script } from './script';
import { Context, newContext } from './runtime/context';
import { Frame } from './runtime/stack/frame';
import { Opcode, toLog } from './runtime/op';
import { Operand } from './runtime';
import { Conf, defaults } from './conf';
import {
    LOG_LEVEL_DEBUG,
    LOG_LEVEL_INFO,
    LOG_LEVEL_NOTICE,
    LOG_LEVEL_WARN,
    LOG_LEVEL_ERROR
} from './log';
import { ResidentActorScript } from '../../resident/scripts';
import { HeapLedger, DefaultHeapLedger } from './runtime/heap/ledger';
import { Foreign } from './type';
import { getLevel } from './event';

/**
 * Slot
 */
export type Slot = [Address, Script, Thread];

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
     * getThread from the system given its address.
     */
    getThread(addr: Address): Maybe<Thread>

    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>

    /**
     * getGroup attempts to retrieve all the members of a group.
     */
    getGroup(name: string): Maybe<Address[]>

    /**
     * getChildren provides the children contexts for an address.
     */
    getChildren(addr: Address): Maybe<Threads>

    /**
     * putThread in the system at the specified address.
     */
    putThread(addr: Address, r: Thread): Platform

    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Platform

    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Platform

    /**
     * remove a Thread from the system.
     */
    remove(addr: Address): Platform

    /**
     * removeRoute configuration.
     */
    removeRoute(target: Address): Platform

    /**
     * spawn an actor using the given Instance as the parent.
     *
     * The Instance is required to verify if it is still part of the system.
     */
    spawn(parent: Instance, tmpl: template.Spawnable): Address

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
     * trigger is used to generate events as the system runs.
     */
    trigger(addr: Address, evt: string, ...args: Type[]): void

    /**
     * logOp is used by Thread to log which opcodes are executed.
     */
    logOp(r: VMThread, f: Frame, op: Opcode, operand: Operand): void

    /**
     * exec a function by name with the provided arguments using the actor
     * instance's thread.
     */
    exec(actor: Instance, funName: string, args?: Foreign[]): void

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

    /**
     * heap memory shared between actor Threads.
     */
    heap = new DefaultHeapLedger();

    /**
     * threadRunner shared between vm threads.
     */
    threadRunner = new SharedThreadRunner(this);

    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State = {

        threads: {

            $: new SharedThread(
                this,
                new ResidentActorScript(),
                this.threadRunner,
                newContext(this._actorIdCounter++, this, '$', {

                    create: () => this,

                    trap: () => template.ACTION_RAISE

                }))

        },

        routers: {},

        groups: {},

        pendingMessages: {}

    };

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

    spawn(parent: Instance, tmpl: template.Spawnable): Address {

        let mparentAddr = getAddress(this.state, parent);

        if (mparentAddr.isNothing()) {

            this.raise(this, new errors.UnknownInstanceErr(parent));

            return '?';

        }

        return this._spawn(mparentAddr.get(), normalize(tmpl));

    }

    _spawn(parent: Address, tmpl: Template): Address {

        let eresult = this.allocate(parent, tmpl);

        if (eresult.isLeft()) {

            this.raise(this.state.threads[parent].context.actor,
                eresult.takeLeft());

            return '?';

        }

        let result = eresult.takeRight();

        this.runActor(result);

        if (Array.isArray(tmpl.children))
            // TODO: Make this call stack friendly some day.
            tmpl.children.forEach(tmp => this._spawn(result, tmp));

        return result;

    }

    allocate(parent: Address, tmpl: Template): Either<Err, Address> {

        if (tmpl.id === ID_RANDOM) {
            let rtime = get(this.state, parent).get();
            let prefix = rtime.context.actor.constructor.name.toLowerCase();
            tmpl.id = `actor::${this._actorIdCounter + 1}~${prefix}`;
        }

        if (isRestricted(<string>tmpl.id))
            return left(new errors.InvalidIdErr(<string>tmpl.id));

        let addr = make(parent, <string>tmpl.id);

        if (this.getThread(addr).isJust())
            return left(new errors.DuplicateAddressErr(addr));

        let args = Array.isArray(tmpl.args) ? tmpl.args : [];

        let act = tmpl.create(this.system, tmpl, ...args);

        // TODO: Have thread types depending on the actor type instead.
        let thr = new SharedThread(
            this,
            new ResidentActorScript(),
            this.threadRunner,
            act.init(newContext(this._actorIdCounter++, act, addr, tmpl))
        );

        this.putThread(addr, thr);

        this.trigger(addr, events.EVENT_ACTOR_CREATED);

        if (isRouter(thr.context.flags))
            this.putRoute(addr, addr);

        if (tmpl.group) {

            let groups = (typeof tmpl.group === 'string') ?
                [tmpl.group] : tmpl.group;

            groups.forEach(g => this.putMember(g, addr));

        }

        return right(addr);

    }

    runActor(target: Address) {

        let mthread = this.getThread(target);

        if (mthread.isNothing())
            return raise(new errors.UnknownAddressErr(target));

        let rtime = mthread.get();

        let ft = rtime.context.actor.start(target);

        // Assumes the actor returned a Future
        if (ft)
            rtime.wait(ft);

        this.trigger(rtime.context.address, events.EVENT_ACTOR_STARTED);

    }

    sendMessage(to: Address, from: Address, msg: Message): boolean {

        let mRouter = this.getRouter(to);

        let mctx = mRouter.isJust() ?
            mRouter :
            this.getThread(to).map(r => r.context)

        //routers receive enveloped messages.
        let actualMessage = mRouter.isJust() ?
            new Envelope(to, from, msg) : msg;

        if (mctx.isJust()) {

            let ctx = mctx.get();

            if (isBuffered(ctx.flags)) {

                ctx.mailbox.push(actualMessage);

                ctx.actor.notify();

            } else {

                ctx.actor.accept(actualMessage);

            }

            this.trigger(from, events.EVENT_SEND_OK, to, msg);
            return true;

        } else {

            this.trigger(from, events.EVENT_SEND_FAILED, to, msg);
            return false;

        }

    }

    getThread(addr: Address): Maybe<Thread> {

        return get(this.state, addr);

    }

    getRouter(addr: Address): Maybe<Context> {

        return getRouter(this.state, addr).map(r => r.context);

    }

    getGroup(name: string): Maybe<Address[]> {

        return getGroup(this.state, name.split('$').join(''));

    }

    getChildren(addr: Address): Maybe<Threads> {

        return fromNullable(getChildren(this.state, addr));

    }

    putThread(addr: Address, r: Thread): PVM {

        this.state = put(this.state, addr, r);
        return this;

    }

    putMember(group: string, addr: Address): PVM {

        putMember(this.state, group, addr);
        return this;

    }

    putRoute(target: Address, router: Address): PVM {

        putRoute(this.state, target, router);
        return this;

    }

    remove(addr: Address): PVM {

        this.state = remove(this.state, addr);

        map(this.state.routers, (r, k) => {

            if (r === addr)
                delete this.state.routers[k];

        });

        return this;

    }

    removeRoute(target: Address): PVM {

        removeRoute(this.state, target);
        return this;

    }

    raise(src: Instance, err: Err): void {

        let maddr = getAddress(this.state, src);

        // For now, ignore requests from unknown instances.
        if (maddr.isNothing()) return;

        let addr = maddr.get();

        //TODO: pause the runtime.
        let next = addr;

        loop:
        while (true) {

            let mrtime = this.getThread(next);

            //TODO: This risks swallowing errors.
            if (mrtime.isNothing()) return;

            let rtime = mrtime.get();

            let trap = rtime.context.template.trap ||
                (() => template.ACTION_RAISE);

            switch (trap(err)) {

                case template.ACTION_IGNORE:
                    break loop;

                case template.ACTION_RESTART:

                    let maddr = get(this.state, next);

                    if (maddr.isJust())
                        this
                            .kill(maddr.get().context.actor, next)
                            .chain(() => {

                                let eRes = this.allocate(getParent(next),
                                    rtime.context.template);

                                if (eRes.isLeft())
                                    return raise(new Error(
                                        eRes.takeLeft().message));

                                this.runActor(eRes.takeRight());

                                return voidPure;

                            }).fork(e => this.raise(this, e));
                    break loop;

                case template.ACTION_STOP:

                    let smaddr = get(this.state, next);

                    if (smaddr.isJust())
                        this.kill(smaddr.get().context.actor, next)
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

    trigger(addr: Address, evt: string, ...args: Type[]) {

        let elvl = getLevel(evt);
        let { level, logger } = this.conf.log;

        if (level >= elvl) {

            switch (elvl) {

                case LOG_LEVEL_DEBUG:
                    logger.debug(addr, evt, args);
                    break;

                case LOG_LEVEL_INFO:
                    logger.info(addr, evt, args);
                    break;

                case LOG_LEVEL_NOTICE:
                case LOG_LEVEL_WARN:
                    logger.warn(addr, evt, args);
                    break;

                case LOG_LEVEL_ERROR:
                    logger.error(addr, evt, args);
                    break;

                default:
                    break;

            }

        }

        //forward the event to relevant hooks.
        if (this.conf.on[evt] != null)
            this.conf.on[evt].apply(null, [addr, evt, ...args]);

    }

    logOp(r: VMThread, f: Frame, op: Opcode, oper: Operand) {

        this.conf.log.logger.debug.apply(null, [
            `[${r.context.address}]`,
            `(${f.script.name})`,
            ...toLog(op, r, f, oper)
        ]);

    }

    kill(parent: Instance, target: Address): Future<void> {

        let that = this;

        return doFuture<void>(function*() {

            let mparentAddr = getAddress(that.state, parent);

            // For now, ignore unknown kill requests.
            if (mparentAddr.isNothing()) return pure(undefined);

            let parentAddr = mparentAddr.get();

            let addrs = isGroup(target) ?
                that.getGroup(target).orJust(() => []).get() : [target];

            return runBatch(addrs.map(addr => doFuture<void>(function*() {
                if ((!isChild(parentAddr, target)) && (target !== parentAddr)) {

                    let err = new Error(
                        `IllegalStopErr: Actor "${parentAddr}" ` +
                        `cannot kill non-child "${addr}"!`);

                    that.raise(parent, err);

                    return raise<void>(err);

                }

                let mthread = that.getThread(addr);

                if (mthread.isNothing()) return pure(<void>undefined);

                let thread = mthread.get();

                let mchilds = that.getChildren(target);

                let childs = mchilds.isJust() ? mchilds.get() : {};

                let killChild = (child: Thread, addr: Address) =>
                    doFuture(function*() {

                        yield child.die();

                        that.remove(addr);

                        that.trigger(addr, events.EVENT_ACTOR_STOPPED);

                        return voidPure;

                    });

                yield runBatch(mapTo(map(childs, killChild), f => f));

                if (addr !== ADDRESS_SYSTEM)
                    yield killChild(thread, addr);

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

        this.exec(this, 'tell', [ref, msg]);
        return this;

    }

    exec(actor: Instance, funName: string, args: Foreign[] = []) {

        let mAddress = getAddress(this.state, actor);

        if (mAddress.isNothing())
            return this.raise(this, new errors.UnknownInstanceErr(actor));

        let thread = <VMThread>(this.state.threads[mAddress.get()]);

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
