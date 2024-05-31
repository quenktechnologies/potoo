import * as template from '../../template';
import * as errors from './runtime/error';

import { Err } from '@quenk/noni/lib/control/error';
import { toError } from '@quenk/noni/lib/control/err';
import { Future } from '@quenk/noni/lib/control/monad/future';

import { Address, ADDRESS_SYSTEM, getParent, isChild } from '../../address';
import { fromSpawnable, Template } from '../../template';
import { Actor, Message } from '../../';
import { Api, Parent } from '../../api';
import { MapAllocator } from './allocator/map';
import { Thread, THREAD_STATE_IDLE } from './thread';
import { GroupMap } from './groups';
import { Scheduler } from './scheduler';
import { RegistrySet } from './registry';

export const MAX_WORKLOAD = 25;

/**
 * Platform is the interface for a virtual machine.
 *
 * It provides methods for manipulating the state of the actors of the system.
 * Some opcode handlers depend on this interface to do their work.
 */
export interface Platform extends Actor, Parent, Api {
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
     * allocateActor resources for an actor using the template provided.
     */
    allocateActor(parent: Thread, tmpl: template.Template): Promise<Address>;

    /**
     * sendActorMessage sends a message to the destination actor.
     */
    sendActorMessage(from: Thread, to: Address, msg: Message): void;

    /**
     * raiseActorError in the target actor.
     */
    raiseActorError(src: Thread, error: Err): Promise<void>;

    /**
     * restartActor at the specified address.
     */
    restartActor(target: Address): Promise<void>;

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
        public scheduler: Scheduler = new Scheduler(),
        public groups = new GroupMap(),
        public registry = new RegistrySet(),
        public allocator = new MapAllocator(scheduler),
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
        await this.raiseActorError(
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
        let address = await this.allocator.allocate(this, parent, tmpl);

        //TODO: this.events.actor.onCreated.dispatch(addr)
        //this.events.publish(addr, events.EVENT_ACTOR_CREATED);

        // TODO: Router support
        // if (isRouter(thread.context.flags)) this.routers.set(addr, addr);

        //TODO: This should happen before the actor is started.
        if (tmpl.group) {
            let groups = Array.isArray(tmpl.group) ? tmpl.group : [tmpl.group];
            groups.forEach(group => this.groups.put(group, address));
        }

        return address;
    }

    sendActorMessage(from: Thread, to: Address, msg: Message) {
        //TODO: this.events.actor.onSend.dispatch(from.context.address, to, msg);
        /*  this.events.publish(
            from.context.address,
            events.EVENT_SEND_START,
            to,
            from,
            msg
        );*/

        let msource = this.allocator.getThread(from.address);
        if (msource.isNothing() || msource.get() !== from) return; //TODO: dispatch invalid send

        let mthread = this.allocator.getThread(to);

        if (mthread.isNothing()) return; //TODO: dispatch invalid send dest.

        mthread.get().notify(msg);

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

    async raiseActorError(src: Thread, error: Err) {
        let prevThread;

        let err = error;

        let currentThread = src;

        let action = template.ACTION_RAISE;

        while (action === template.ACTION_RAISE) {
            if (prevThread) {
                await this.allocator.deallocate(prevThread);

                prevThread = currentThread;

                let mcurrentThread = this.allocator.getThread(
                    getParent(prevThread.address)
                );

                if (mcurrentThread.isNothing()) break;

                currentThread = mcurrentThread.get();

                err = new errors.ActorTerminatedErr(
                    currentThread.address,
                    src.address,
                    error
                );
            } else {
                prevThread = currentThread;
            }

            let tmpl = this.allocator.getTemplate(currentThread.address).get();

            let trap = tmpl.trap ?? defaultTrap;

            action = trap(err);
        }

        switch (action) {
            case template.ACTION_IGNORE:
                // TODO: do this via a method. Like thread.resume()
                currentThread.state = THREAD_STATE_IDLE;
                break;

            case template.ACTION_RESTART:
                await this.restartActor(currentThread.address);
                break;

            case template.ACTION_STOP:
                await this.killActor(currentThread, currentThread.address);
                break;

            default:
                throw toError(err);
        }
    }

    async restartActor(target: Address): Promise<void> {
        let mtargetThread = this.allocator.getThread(target);
        let mparent = this.allocator.getThread(getParent(target));

        if (mtargetThread.isNothing())
            return Future.raise(new errors.UnknownAddressErr(target));

        if (mparent.isNothing())
            return Future.raise(new errors.UnknownAddressErr(target));

        let tmpl = this.allocator.getTemplate(target).get();

        await this.allocator.deallocate(mtargetThread.get());

        await this.allocateActor(mparent.get(), tmpl);
    }

    async killActor(src: Thread, target: Address): Promise<void> {
        if (!isChild(src.address, target)) {
            return Future.raise(new errors.IllegalStopErr(src.address, target));
        }

        let mtargetThread = this.allocator.getThread(target);

        //TODO: warn thread not found.
        if (mtargetThread.isNothing()) return;

        await this.allocator.deallocate(mtargetThread.get());
    }
}

const defaultTrap = () => template.ACTION_RAISE;
