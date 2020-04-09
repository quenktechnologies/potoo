import * as template from '../../template';
import * as errors from './runtime/error';
import * as events from './event';

import { Err } from '@quenk/noni/lib/control/error';
import { Maybe, nothing, fromNullable, just } from '@quenk/noni/lib/data/maybe'
import { Either, left, right } from '@quenk/noni/lib/data/either';
import { empty } from '@quenk/noni/lib/data/array';
import { reduce, map } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';

import {
    Address,
    isGroup,
    isRestricted,
    make,
    getParent,
    ADDRESS_SYSTEM
} from '../../address';
import { normalize, Template } from '../../template';
import { isRouter, isBuffered } from '../../flags';
import { Message } from '../../message';
import { Instance } from '../../';
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
    Runtimes
} from './state';
import { Script, PVM_Value } from './script';
import { Context, newContext } from './runtime/context';
import { Thread } from './runtime/thread';
import { Heap } from './runtime/heap';
import { Runtime } from './runtime';
import { Conf, defaults } from './conf';

type Slot = [Address, Script, Runtime];

/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform {

    /**
     * allocate a new Runtime for an actor.
     *
     * It is an error if a Runtime has already been allocated for the actor.
     */
    allocate(self: Address, t: template.Template<System>): Either<Err, Address>

    /**
     * runActor triggers the run code/method for an actor in the system.
     *
     * It is an error if the actor does not exist.
     */
    runActor(target: Address): Either<Err, void>

    /**
     * sendMessage to an actor in the system.
     *
     * The result is true if the actor was found or false
     * if the actor is not in the system.
     */
    sendMessage(to: Address, from: Address, msg: Message): boolean

    /**
     * getRuntime from the system given its address.
     */
    getRuntime(addr: Address): Maybe<Runtime>

    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>

    /**
     * getGroup attemps to retreive all the members of a group.
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
     * kill terminates the actor at the specified address.
     */
    kill(addr: Address): void

    /**
     * raise does the error handling on behalf of Runtimes.
     */
    raise(addr: Address, err: Err): void

    /**
     * trigger is used to generate events as the system runs.
     */
    trigger(addr: Address, evt: string, ...args: Type[]): void

}

/**
 * PVM is the Potoo Virtual Machine.
 */
export class PVM<S extends System> implements Platform {

    constructor(public system: S, public conf: Conf = defaults()) { }

    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State = {

        runtimes: {},

        routers: {},

        groups: {}

    };

    /**
     * queue of scripts to be executed by the system in order. 
     */
    queue: Slot[] = [];

    running = false;

    allocate(parent: Address, t: Template<System>): Either<Err, Address> {

        let temp = normalize(t);

        if (isRestricted(temp.id))
            return left(new errors.InvalidIdErr(temp.id));

        let addr = make(parent, temp.id);

        if (this.getRuntime(addr).isJust())
            return left(new errors.DuplicateAddressErr(addr));

        let args = Array.isArray(t.args) ? t.args : [];

        let act = t.create(this.system, ...args);

        let thr = new Thread(this, new Heap(),
            act.init(newContext(act, addr, t)));

        this.putRuntime(addr, thr);

        if (isRouter(thr.context.flags))
            this.putRoute(addr, addr);

        if (temp.group) {

            let groups = (typeof temp.group === 'string') ?
                [temp.group] : temp.group;

            groups.forEach(g => this.putMember(g, addr));

        }

        return right(addr);

    }

    runActor(target: Address): Either<Err, void> {

        //TODO: async support

        let mrtime = this.getRuntime(target);

        if (mrtime.isNothing())
            return left(new errors.UnknownAddressErr(target));

        let rtime = mrtime.get();

        rtime.context.actor.start();

        return right(undefined);

    }

    sendMessage(to: Address, from: Address, msg: Message): boolean {

        let mRouter = this.getRouter(to);

        let mctx = mRouter.isJust() ?
            mRouter :
            this.getRuntime(to).map(r => r.context)

        if (mctx.isJust()) {

            let ctx = mctx.get();

            if (isBuffered(ctx.flags)) {

                ctx.mailbox.push(msg);

                ctx.actor.notify();

            } else {

                ctx.actor.accept(msg);

            }

            this.trigger(events.EVENT_SEND_OK, from, to, msg);
            return true;

        } else {

            this.trigger(events.EVENT_SEND_FAILED, from, to, msg);
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

    putRuntime(addr: Address, r: Runtime): PVM<S> {

        this.state = put(this.state, addr, r);
        return this;

    }

    putMember(group: string, addr: Address): PVM<S> {

        putMember(this.state, group, addr);
        return this;

    }

    putRoute(target: Address, router: Address): PVM<S> {

        putRoute(this.state, target, router);
        return this;

    }

    remove(addr: Address): PVM<S> {

        this.state = remove(this.state, addr);

        map(this.state.routers, (r, k) => {

            if (r === addr)
                delete this.state.routers[k];

        });

        return this;

    }

    removeRoute(target: Address): PVM<S> {

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

            //TODO: async support
            switch (trap(err)) {

                case template.ACTION_IGNORE:
                    break loop;

                case template.ACTION_RESTART:

                    this.kill(next);

                    let eRes = this
                        .allocate(getParent(next), rtime.context.template)
                        .chain(a => this.runActor(a));

                    if (eRes.isLeft())
                        throw new Error(eRes.takeLeft().message);

                    break loop;

                case template.ACTION_STOP:
                    this.kill(next);
                    break loop;

                default:
                    //escalate
                    next = getParent(next);
                    break;

            }

        }

    }

    trigger(addr: Address, evt: string, ...args: Type[]) {

        if (this.conf.log)
            this.conf.log(evt, addr, args);

    }

    kill(addr: Address) {

        let addrs = isGroup(addr) ?
            this.getGroup(addr).orJust(() => []).get() : [addr];

        addrs.every(a => {

            //TODO: async support

            let mrun = this.getRuntime(a);

            if (mrun.isJust())
                mrun.get().terminate();

        });

    }

    exec(i: Instance, s: Script): Maybe<PVM_Value> {

        let mslot = getSlot(this.state, i);

        if (mslot.isNothing()) {

            this.trigger(events.EVENT_INVALID_EXEC, '$', i);
            return nothing();

        }

        let [addr, rtime] = mslot.get();

        let ret: Maybe<Maybe<PVM_Value>> = nothing();

        if (s.immediate === true) {

            rtime.invokeMain(s);

            ret = just(rtime.run());

        } else {

            this.queue.push([addr, s, rtime]);

            if (this.running === true) return nothing();

            this.running = true;

            while ((!empty(this.queue)) && this.running) {

                let next = this.queue.shift();

                let [, script, runtime] = <Slot>next;

                runtime.invokeMain(script);

                if (ret.isNothing()) {

                    //Always return the first executed script.
                    ret = just(runtime.run());

                } else {

                    runtime.run();

                }

            }

            this.running = false;

        }

        return ret.isJust() ? ret.get() : <Maybe<PVM_Value>>ret;

    }

}

const getSlot = (s: State, actor: Instance): Maybe<[Address, Runtime]> =>
    reduce(s.runtimes, nothing(), (p: Maybe<[Address, Runtime]>, c, k) =>
        c.context.actor === actor ? fromNullable([k, c]) : p);
