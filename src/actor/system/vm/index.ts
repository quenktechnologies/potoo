import * as template from '../../template';

import { Err } from '@quenk/noni/lib/control/error';
import { Maybe, nothing, fromNullable } from '@quenk/noni/lib/data/maybe'
import { empty } from '@quenk/noni/lib/data/array';

import { Address } from '../../address';
import { Instance } from '../../';
import { System } from '../';
import { Context, newContext, ErrorHandler } from './runtime/context';
import {
    State,
    get,
    put,
    putRoute,
    putMember,
    removeRoute,
    getRouter,
} from './state';
import { Runtime } from './runtime';
import { Script, PVM_Value } from './script';
import { reduce } from '@quenk/noni/lib/data/record';

/**
 * Slot
 */
export type Slot = [Address, Script, Runtime];

/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends ErrorHandler {

    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<System>): Context

    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<Context>

    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>

    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: Context): Platform

    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Platform

    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Platform

}

/**
 * PVM is the Potoo Virtual Machine.
 */
export class PVM<S extends System> implements Platform {

    constructor(
        public system: S) { }

    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State = {

        contexts: {},

        runtimes: {},

        routers: {},

        groups: {}

    };

    /**
     * queue of scripts to be executed by the system in order. 
     */
    queue: Slot[] = [];

    running = false;

    raise(_: Err): void {

        //TODO: implement

    }

    allocate(addr: Address, t: template.Template<System>): Context {

        let args = Array.isArray(t.args) ? t.args : [];
        let act = t.create(this.system, ...args);

        //TODO: review instance init.
        return newContext(act, addr, t);

    }

    getContext(addr: Address): Maybe<Context> {

        return get(this.state, addr);

    }

    getRouter(addr: Address): Maybe<Context> {

        return getRouter(this.state, addr);

    }

    putContext(addr: Address, ctx: Context): PVM<S> {

        this.state = put(this.state, addr, ctx);
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

    removeRoute(target: Address): PVM<S> {

        removeRoute(this.state, target);
        return this;

    }

    exec(i: Instance, s: Script): Maybe<PVM_Value> {

        let ret: Maybe<PVM_Value> = nothing();

        let mslot = getSlot(this.state, i);

        //TODO: EVENT_INVALID_EXEC
        if (mslot.isNothing()) return nothing();

        let [addr, rtime] = mslot.get();

        this.queue.push([addr, s, rtime]);

        if (this.running === true) nothing();

        this.running = true;

        while ((!empty(this.queue)) && this.running) {

            let next = this.queue.shift();

            let [, script, runtime] = <Slot>next;

            runtime.invokeMain(script);

            ret = runtime.run();

        }

        this.running = false;

        return ret;

    }

}

const getSlot = (s: State, actor: Instance): Maybe<[Address, Runtime]> =>
    reduce(s.runtimes, nothing(), (p: Maybe<[Address, Runtime]>, c, k) =>
        c.context.actor === actor ? fromNullable([k, c]) : p);
