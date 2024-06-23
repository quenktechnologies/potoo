import * as template from '../../template';
import * as errors from './runtime/error';

import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';

import { Address, ADDRESS_SYSTEM,  isChild, isGroup } from '../../address';
import { fromSpawnable, Template } from '../../template';
import { Actor, Message } from '../../';
import { Api, Parent } from '../../api';
import { MapAllocator } from './allocator/map';
import { ErrorStrategy, SupervisorErrorStrategy } from './strategy/error';
import { Thread } from './thread';
import { GroupMap } from './group';
import { Scheduler } from './scheduler';
import { RegistrySet } from './registry';
import { Allocator } from './allocator';

export const MAX_WORKLOAD = 25;

/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends Actor, Parent, Api {
    /**
     * allocator used to manage thread resources for an actor.
     */
    allocator: Allocator;

    /**
     * scheduler used for co-ordinating actor thread execution.
     */
    scheduler: Scheduler;

    /**
     * errors strategy used to handle errors that occur within the system.
     */
    errors: ErrorStrategy;

    /**
     * log service for the VM.
     *
     * Used to access the internal logging API.
     */
    //log: LogWritable;

    /**
     * events service for the VM.
     *
     * Used to publish VM events to interested listeners.
     */
    //events: EventSource;

    registry: RegistrySet;

    /**
     * groups holds the mapping of group names to actor addresses.
     */
    groups: GroupMap 

    /**
     * allocateActor resources for an actor using the template provided.
     */
    allocateActor(parent: Thread, tmpl: template.Template): Promise<Address>;

    /**
     * sendActorMessage sends a message to the destination actor.
     */
    sendActorMessage(from: Thread, to: Address, msg: Message): void;

    /**
     * killActor at the specified address.
     */
    killActor(src: Thread, target: Address): Promise<void>;
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
        public allocator: Allocator = new MapAllocator(() => this),
        public scheduler: Scheduler = new Scheduler(),
        public errors: ErrorStrategy = new SupervisorErrorStrategy(() => this),
        public registry = new RegistrySet(),
        public groups:GroupMap = new GroupMap(),
        public self = ADDRESS_SYSTEM
    ) {}

    /**
     * create a new PVM instance using the provided configuration.
     */
    static create(): PVM {
        return new PVM(); //TODO: add thread for system to allocator.
    }

    // Actor

    async start() {}

    //TODO: events.OnRootMessage.dispatch();
    async notify() {}

    //TODO: stop all actors?
    async stop() {}

    // Api

    async spawn(tmpl: template.Spawnable): Promise<Address> {
        return this.allocateActor(
            this.allocator.getThread(ADDRESS_SYSTEM).get(),
            fromSpawnable(tmpl)
        );
    }

    async tell(to: Address, msg: Message) {
        this.sendActorMessage(
            this.allocator.getThread(ADDRESS_SYSTEM).get(),
            to,
            msg
        );
    }

    async raise(err: Err) {
        await this.errors.raise(
            this.allocator.getThread(ADDRESS_SYSTEM).get(),
            err
        );
    }

    async kill(addr: Address) {
        await this.killActor(
            this.allocator.getThread(ADDRESS_SYSTEM).get(),
            addr
        );
    }

    async receive<T>() {
        return <Promise<T>>Future.raise(new Error('Not implemented'));
    }

    // Platform

    async allocateActor(parent: Thread, tmpl: Template): Promise<Address> {
        let address = await this.allocator.allocate(parent, tmpl);

        //TODO: this.events.actor.onCreated.dispatch(addr)
        //this.events.publish(addr, events.EVENT_ACTOR_CREATED);

        // TODO: Router support
        // if (isRouter(thread.context.flags)) this.routers.set(addr, addr);

        //TODO: This should happen before the actor is started.

        return address;
    }

    sendActorMessage(_from: Thread, to: Address, msg: Message) {
        //TODO: this.events.actor.onSend.dispatch(from.context.address, to, msg);
        /*  this.events.publish(
            from.context.address,
            events.EVENT_SEND_START,
            to,
            from,
            msg
        );*/

      let targets = isGroup(to) ? this.groups.getMembers(to) : [to];
          let threads = this.allocator.getThreads(targets);
          for(let thread of threads) {
            thread.notify(msg).catch(err => thread.raise(err));
          }

        //TODO: this.events.actor.onSendFailed.dispatch(from.context.address, to, msg);
        /*   this.events.publish(
                from.context.address,
                events.EVENT_SEND_FAILED,
                to,
                msg
            );*/

        //TODO: this.events.actor.onSendOk.dispatch(from.context.address, to, msg);
        /* this.events.publish(
            from.context.address,
            events.EVENT_SEND_OK,
            to,
            msg
        );*/
    }

    async killActor(src: Thread, target: Address): Promise<void> {
        if (src.address !== target && !isChild(src.address, target)) {
            return Future.raise(new errors.IllegalStopErr(src.address, target));
        }

        let mtargetThread = this.allocator.getThread(target);

        //TODO: warn thread not found.
        if (mtargetThread.isNothing()) return;

        await this.allocator.deallocate(mtargetThread.get());
    }
}
