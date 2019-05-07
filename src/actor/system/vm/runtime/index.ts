import * as template from '../../../template';
import { Maybe } from '@quenk/noni/lib/data/maybe'
import { Contexts, Context, ErrorHandler } from '../../../context';
import { Address } from '../../../address';
import { Message } from '../../../message';
import { Configuration } from '../../configuration';
import { Frame } from '../frame';
import { Value, Script } from '../script';
import { System } from '../../';

/**
 * Runtime interface.
 *
 * An Runtime is responsible for executing the Op codes that allow
 * actors to interact with the rest of the system.
 */
export interface Runtime extends ErrorHandler {

    /**
     * self is the address of the actor.
     */
    self: Address

    /**
     * config provides the system configuration.
     */
    config(): Configuration

    /**
     * exec a Script on behalf of the actor.
     */
    exec(s: Script): Maybe<Value>

    /**
     * current provides the Frame being executed (if any).
     */
    current(): Maybe<Frame>

    /**
     * allocate a new Context for an actor.
     */
    allocate(self: Address, t: template.Template<Context, System<Context>>): Context

    /**
     * getContext from the system given its address.
     */
    getContext(addr: Address): Maybe<Context>

    /**
     * getRouter attempts to retrieve a router for the address specified.
     */
    getRouter(addr: Address): Maybe<Context>

    /**
     * getGroup attemps to retreive all the members of a group.
     */
    getGroup(name: string): Maybe<Address[]>

    /**
     * getChildren provides the children context's for an address.
     */
    getChildren(addr: Address): Maybe<Contexts<Context>>

    /**
     * putContext in the system at the specified address.
     */
    putContext(addr: Address, ctx: Context): Runtime

    /**
     * removeContext from the system.
     */
    removeContext(addr: Address): Runtime

    /**
     * putRoute configures a router for all actors that are under the
     * target address.
     */
    putRoute(target: Address, router: Address): Runtime

    /**
     * removeRoute configuration.
     */
    removeRoute(target: Address): Runtime

    /**
     * putMember puts an address into a group.
     */
    putMember(group: string, addr: Address): Runtime

    /**
     * removeMember from a group.
     */
    removeMember(group: string, addr: Address): Runtime;

    /**
     * push a new Frame onto the stack, triggering
     * its execution.
     */
    push(f: Frame): Runtime

    /**
     * clear all Frames from the stack, thus ending
     * current execution.
     */
    clear(): Runtime

    /**
     * drop a Message
     */
    drop(m: Message): Runtime

}
