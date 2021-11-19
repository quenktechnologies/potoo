import * as template from '../../template';
import * as scripts from '../../resident/scripts';
import * as errors from './runtime/error';
import * as events from './event';

import { Err } from '@quenk/noni/lib/control/error';
import { Future, pure, raise, batch } from '@quenk/noni/lib/control/monad/future';
import { Maybe, nothing, fromNullable } from '@quenk/noni/lib/data/maybe'
import { Either, left, right } from '@quenk/noni/lib/data/either';
import {
    empty,
    dedupe,
    contains, partition,
    distribute
} from '@quenk/noni/lib/data/array';
import { Record, reduce, map, rmerge, mapTo } from '@quenk/noni/lib/data/record';
import { remove as arremove } from '@quenk/noni/lib/data/array';
import { Type, isObject } from '@quenk/noni/lib/data/type';

import {
    Address,
    isGroup,
    isRestricted,
    make,
    getParent,
    ADDRESS_SYSTEM,
    isChild
} from '../../address';
import { normalize, Template } from '../../template';
import { isRouter, isBuffered } from '../../flags';
import { Message, Envelope } from '../../message';
import { Instance, Actor } from '../../';
import { System } from '../';

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
    Runtimes,
    getAddress
} from './state';
import { Script } from './script';
import { Context, newContext } from './runtime/context';
import { Thread } from './runtime/thread';
import { Heap } from './runtime/heap';
import { Runtime, Operand } from './runtime';
import { Conf, defaults } from './conf';
import { Frame } from './runtime/stack/frame';
import { Opcode, toLog } from './runtime/op';
import {
    LOG_LEVEL_DEBUG,
    LOG_LEVEL_INFO,
    LOG_LEVEL_NOTICE,
    LOG_LEVEL_WARN,
    LOG_LEVEL_ERROR
} from './log';
import { getLevel } from './event';
import { PTValue } from './type';
import { GarbageCollector } from './runtime/gc';

/**
 * Slot
 */
export type Slot = [Address, Script, Runtime];

export const MAX_WORK_LOAD = 25;

/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends Actor {

    /**
     * heap shared between actor runtimes.
     */
    heap: Heap

    /**
     * gc is the garbage collector.
     */
    gc: GarbageCollector

    /**
     * allocate a new Runtime for an actor.
     *
     * It is an error if a Runtime has already been allocated for the actor.
     */
    allocate(self: Address, t: template.Template): Either<Err, Address>

    /**
     * runActor provides a Future that when fork()'d will execute the 
     * start code/method for the target actor.
     *
     */
    runActor(target: Address): Future<void>

    /**
     * sendMessage to an actor in the system.
     *
     * The result is true if the actor was found or false
     * if the actor is not in the system.
     */
    sendMessage(to: Address, from: Address, msg: PTValue): boolean

    /**
     * getRuntime from the system given its address.
     */
    getRuntime(addr: Address): Maybe<Runtime>

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
    getChildren(addr: Address): Maybe<Runtimes>

    /**
     * putRuntime in the system at the specified address.
     */
    putRuntime(addr: Address, r: Runtime): Platform

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
     * remove a Runtime from the system.
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
    kill(parent: Address, target: Address): Future<void>

    /**
     * raise does the error handling on behalf of Runtimes.
     */
    raise(addr: Address, err: Err): void

    /**
     * trigger is used to generate events as the system runs.
     */
    trigger(addr: Address, evt: string, ...args: Type[]): void

    /**
     * logOp is used by Runtimes to log which opcodes are executed.
     */
    logOp(r: Runtime, f: Frame, op: Opcode, operand: Operand): void

    /**
     * runTask executes an async operation on behalf of a Runtime.
     */
    runTask(addr: Address, ft: Future<void>): void

    /**
     * exec code in the VM on behalf of the provided actor instance.
     */
    exec(i: Instance, s: Script): void

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

    /**
     * heap memory shared between actor Threads.
     */
    heap = new Heap();

    /**
     * gc for the heap.
     */
    gc = new GarbageCollector(this.heap);

    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State = {

        runtimes: {

            $: new Thread(this, (newContext(this, '$', { create: () => this })))

        },

        routers: {},

        groups: {},

        pendingMessages: {}

    };

    /**
     * Create a new PVM instance using the provided System impelmentation and
     * configuration object.
     */
    static create<S extends System>(s: S, conf: object = {}): PVM {

        return new PVM(s, <Conf>rmerge(<Record<Type>>defaults(), <any>conf));

    }

    /**
     * runQ is the queue of pending Scripts to be executed.
     */
    runQ: Slot[] = [];

    /**
     * waitQ is the queue of pending Scripts for Runtimes that are awaiting
     * the completion of an async task.
     */
    waitQ: Slot[] = [];

    /**
     * blocked is a 
     */
    blocked: Address[] = [];

    running = false;

    init(c: Context): Context {

        return c;

    }

    accept(m: Message) {

        return this.conf.accept(m);

    }

    start() {

    }

    notify() {

    }

    stop(): Future<void> {

        return this.kill(ADDRESS_SYSTEM, ADDRESS_SYSTEM);

    }

    spawn(parent: Instance, tmpl: template.Spawnable): Address {

        let mparentAddr = getAddress(this.state, parent);

        if (mparentAddr.isNothing()) {

            this.raise('$', new errors.UnknownInstanceErr(parent));

            return '?';

        }

        let normalTmpl = normalize(isObject(tmpl) ?
            <Template>tmpl :
            { create: tmpl });

        return this._spawn(mparentAddr.get(), normalTmpl);

    }

    _spawn(parent: Address, tmpl: Template): Address {

        let eresult = this.allocate(parent, tmpl);

        if (eresult.isLeft()) {

            this.raise('$', eresult.takeLeft());

            return '?';

        }

        let result = eresult.takeRight();

        this.runTask(result, this.runActor(result));

        if (Array.isArray(tmpl.children)) {

            // TODO: Make this call stack friendly some day.
            tmpl.children.forEach(tmp => this._spawn(result, tmp));

        }

        return result;

    }

    allocate(parent: Address, tmpl: Template): Either<Err, Address> {

        if (isRestricted(<string>tmpl.id))
            return left(new errors.InvalidIdErr(<string>tmpl.id));

        let addr = make(parent, <string>tmpl.id);

        if (this.getRuntime(addr).isJust())
            return left(new errors.DuplicateAddressErr(addr));

        let args = Array.isArray(tmpl.args) ? tmpl.args : [];

        let act = tmpl.create(this.system, tmpl, ...args);

        let thr = new Thread(this, act.init(newContext(act, addr, tmpl)));

        this.putRuntime(addr, thr);

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

    runActor(target: Address): Future<void> {

        let mrtime = this.getRuntime(target);

        if (mrtime.isNothing())
            return raise(new errors.UnknownAddressErr(target));

        let rtime = mrtime.get();

        let ft = rtime.context.actor.start(target);

        this.trigger(rtime.context.address, events.EVENT_ACTOR_STARTED);

        return ((ft != null) ? <Future<void>>ft : pure(<void>undefined));

    }

    runTask(addr: Address, ft: Future<void>) {

        this.blocked = dedupe(this.blocked.concat(addr));

        //XXX: Fork is used here instead of finally because the raise() method
        // may trigger side-effects. For example the actor being stopped or 
        // restarted.
        ft
            .fork(
                (e: Error) => {

                    this.blocked = arremove(this.blocked, addr);

                    this.raise(addr, e);

                },
                () => {

                    this.blocked = arremove(this.blocked, addr);

                    //TODO: This is done to keep any waiting scripts going after
                    //the task completes. The side-effect of this needs to be
                    //observed a bit more but scripts of blocked actors other
                    //than addr should not be affected. In future it may suffice
                    //to run only scripts for addr.
                    this.run();

                });

    }

    sendMessage(to: Address, from: Address, m: PTValue): boolean {

        let mRouter = this.getRouter(to);

        let mctx = mRouter.isJust() ?
            mRouter :
            this.getRuntime(to).map(r => r.context)

        //TODO: We dont want to pass HeapObjects to actors?
        //Its annoying for ES actors but may be necessary for vm actors.
        //There are various things that could be done here. If we make all 
        //PTValues an interface then we could just promote. Alternatively we
        //could introduce a Foreign PTValue to represent foreign values.
        //Much more thought is needed but for now we don't want HeapObjects
        //passed to ES actors.
        let msg = isObject(m) ? m.promote() : m;

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

    getRuntime(addr: Address): Maybe<Runtime> {

        return get(this.state, addr);

    }

    getRouter(addr: Address): Maybe<Context> {

        return getRouter(this.state, addr).map(r => r.context);

    }

    getGroup(name: string): Maybe<Address[]> {

        return getGroup(this.state, name.split('$').join(''));

    }

    getChildren(addr: Address): Maybe<Runtimes> {

        return fromNullable(getChildren(this.state, addr));

    }

    putRuntime(addr: Address, r: Runtime): PVM {

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

    raise(addr: Address, err: Err): void {

        //TODO: pause the runtime.
        let next = addr;

        loop:
        while (true) {

            let mrtime = this.getRuntime(next);

            if (next === ADDRESS_SYSTEM) {

                if (err instanceof Error)
                    throw err;

                throw new Error(err.message);

            }

            //TODO: This risks swallowing errors.
            if (mrtime.isNothing()) return;

            let rtime = mrtime.get();

            let trap = rtime.context.template.trap ||
                (() => template.ACTION_RAISE);

            switch (trap(err)) {

                case template.ACTION_IGNORE:
                    break loop;

                case template.ACTION_RESTART:

                    this.runTask(next,
                        this
                            .kill(next, next)
                            .chain(() => {

                                let eRes = this.allocate(getParent(next),
                                    rtime.context.template);

                                return eRes.isLeft() ?
                                    raise(new Error(eRes.takeLeft().message)) :
                                    this.runActor(eRes.takeRight());

                            }));

                    break loop;

                case template.ACTION_STOP:
                    this.runTask(next, this.kill(next, next));
                    break loop;

                default:
                    //escalate
                    next = getParent(next);
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

    logOp(r: Runtime, f: Frame, op: Opcode, oper: Operand) {

        if (this.conf.log.level >= LOG_LEVEL_DEBUG)
            this.conf.log.logger.debug.apply(null, [
                `[${r.context.address}]`,
                `(${f.script.name})`,
                ...toLog(op, r, f, oper)
            ]);

    }

    kill(parent: Address, target: Address): Future<void> {

        let addrs = isGroup(target) ?
            this.getGroup(target).orJust(() => []).get() : [target];

        return scheduleFutures(addrs.map((addr): Future<void> => {

            if ((!isChild(parent, target)) && (target !== parent))
                return raise(new Error(`IllegalStopErr: Actor ${parent} ` +
                    `cannot kill non-child ${addr}!`));

            let mrun = this.getRuntime(addr);

            if (mrun.isNothing()) return pure(<void>undefined);

            let run = mrun.get();

            let mchilds = this.getChildren(target);

            let childs = mchilds.isJust() ? mchilds.get() : {};

            let cwork = mapTo(map(childs, (r, k) =>
                r
                    .die()
                    .chain(() => {

                        this.remove(k);
                        return pure(<void>undefined);

                    })), f => f);

            return scheduleFutures(cwork)
                .chain(() => {

                    return addr === ADDRESS_SYSTEM ?
                        pure(<void>undefined) :
                        run.die();

                })
                .chain(() => {

                    this.trigger(run.context.address,
                        events.EVENT_ACTOR_STOPPED);

                    if (addr !== ADDRESS_SYSTEM)
                        this.remove(addr);

                    return pure(<void>undefined);

                });

        }));

    }

    /**
     * tell allows the vm to send a message to another actor via opcodes.
     *
     * If you want to immediately deliver a message, use [[sendMessage]] instead.
     */
    tell<M>(ref: Address, m: M): PVM {

        this.exec(this, new scripts.Tell(ref, m));
        return this;

    }

    exec(i: Instance, s: Script): void {

        let mslot = getSlot(this.state, i);

        if (mslot.isNothing()) {

            this.trigger(ADDRESS_SYSTEM, events.EVENT_EXEC_INSTANCE_STALE);

        } else {

            let [addr, rtime] = mslot.get();

            this.runQ.push([addr, s, rtime]);

            this.run();

        }

    }

    run() {

        if (this.running === true) return;

        this.running = true;

        doRun:
        while (this.running) {

            while (!empty(this.runQ)) {

                let next = <Slot>this.runQ.shift();

                let [addr, script, rtime] = next;

                let mctime = this.getRuntime(addr);

                //is the runtime still here?
                if (mctime.isNothing()) {

                    this.trigger(addr, events.EVENT_EXEC_ACTOR_GONE);

                    //is it the same instance?
                } else if (mctime.get() !== rtime) {

                    this.trigger(addr, events.EVENT_EXEC_ACTOR_CHANGED);

                    // is the runtime awaiting an async task?
                } else if (contains(this.blocked, addr)) {

                    this.waitQ.push(next);

                } else {

                    rtime.exec(script);

                }

            }

            let [unblocked, blocked] = partition(this.waitQ, s =>
                !contains(this.blocked, s[0]));

            this.waitQ = blocked;

            if (unblocked.length > 0) {

                this.runQ = this.runQ.concat(unblocked);
                continue doRun;

            }

            this.running = false;

        }
    }

}

const getSlot = (s: State, actor: Instance): Maybe<[Address, Runtime]> =>
    reduce(s.runtimes, nothing(), (p: Maybe<[Address, Runtime]>, c, k) =>
        c.context.actor === actor ? fromNullable([k, c]) : p);

const scheduleFutures = (work: Future<void>[]): Future<void> =>
    batch(distribute(work, MAX_WORK_LOAD))
        .chain(() => pure(<void>undefined));
