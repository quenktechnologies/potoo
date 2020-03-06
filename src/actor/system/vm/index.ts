import * as template from '../../template';

import { Err } from '@quenk/noni/lib/control/error';
import { Maybe } from '@quenk/noni/lib/data/maybe'

import { Context, newContext, ErrorHandler } from '../../context';
import { Address } from '../../address';
import {
    State,
    get,
    put,
    putRoute,
    putMember,
    removeRoute,
    getRouter,
} from '../state';
import { Configuration } from '../configuration';
import { Instance } from '../../';
import { System } from '../';
import { Runtime } from './runtime';
import { Script } from './script';

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
        public system: S,
        public config: Configuration) { }

    /**
     * state contains information about all the actors in the system, routers
     * and groups.
     */
    state: State = {

        contexts: {},

        routers: {},

        groups: {}

    };

    /**
     * pending scripts to execute.
     */
    pending: Runtime[] = [];

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

    exec(_i: Instance, _s: Script): void {



    }

}
