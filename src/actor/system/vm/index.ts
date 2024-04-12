import * as template from '../../template';
import * as errors from './runtime/error';

import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { isFunction } from '@quenk/noni/lib/data/type';
import { merge, mapTo, isRecord } from '@quenk/noni/lib/data/record';

import { Address, ADDRESS_SYSTEM, getParent, isChild } from '../../address';
import { Template } from '../../template';
import { Message } from '../../message';
import { Actor } from '../../';
import { Thread, THREAD_STATE_IDLE } from './thread';
import { Context } from './runtime/context';
import { GroupMap } from './groups';
import { RouterMap } from './routers';
import { Scheduler } from './scheduler';
import { RegistrySet } from './registry';
import { MapAllocator } from './allocator/map';

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
    //log: LogWritable;

    /**
     * events service for the VM.
     *
     * Used to publish VM events to interested listeners.
     */
    //events: EventSource;

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
    allocate(parent: Thread, tmpl: template.Template): Future<Address>;

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
        public scheduler: Scheduler = new Scheduler(),
        public routers = new RouterMap(),
        public groups = new GroupMap(),
        public registry = new RegistrySet(),
        public allocator = new MapAllocator()
    ) {}

    /**
     * create a new PVM instance using the provided configuration.
     */
    static create(): PVM {
        return new PVM();
    }

    init(c: Context): Context {
        return c;
    }

    accept() {
        //TODO: events.OnRootMessage.dispatch();
    }

    async start() {}

    notify() {}

    async stop() {}

    spawn(tmpl: template.Spawnable): Future<Address> {
        return Future.do(async () => {
            return this.allocate(
                this.allocator.getThread(ADDRESS_SYSTEM).get(),
                normalize(tmpl)
            );
        });
    }

    allocate(parent: Thread, tmpl: Template): Future<Address> {
        return Future.do(async () => {
            let address = await this.allocator.allocate(this, parent, tmpl);

            //TODO: this.events.actor.onCreated.dispatch(addr)
            //this.events.publish(addr, events.EVENT_ACTOR_CREATED);

            // TODO: Router support
            // if (isRouter(thread.context.flags)) this.routers.set(addr, addr);

            //TODO: This should happen before the actor is started.
            if (tmpl.group) {
                let groups = Array.isArray(tmpl.group)
                    ? tmpl.group
                    : [tmpl.group];
                groups.forEach(group => this.groups.put(group, address));
            }

            return address;
        });
    }

    sendMessage(_: Thread, to: Address, msg: Message) {
        //TODO: this.events.actor.onSend.dispatch(from.context.address, to, msg);
        /*  this.events.publish(
            from.context.address,
            events.EVENT_SEND_START,
            to,
            from,
            msg
        );*/

        let mthread = this.allocator.getThread(to);

        if (mthread.isJust()) {
            mthread.get().notify(msg);
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

    raise(src: Thread, err: Err): Future<void> {
        return Future.do(async () => {
            let currentThread = src;

            loop: while (true) {
                let mparent = this.allocator.getThread(
                    getParent(currentThread.context.address)
                );

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
                            // TODO
                            // let action = this.conf.trap(err);
                            // if (action === template.ACTION_IGNORE) break loop;

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
            if (!isChild(src.context.address, target)) {
                return Future.raise(
                    new errors.IllegalStopErr(src.context.address, target)
                );
            }

            let mtargetThread = this.allocator.getThread(target);

            //TODO: warn thread not found.
            if (mtargetThread.isNothing()) return;

            await this.allocator.deallocate(mtargetThread.get());
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
        this.sendMessage(
            this.allocator.getThread(ADDRESS_SYSTEM).get(),
            to,
            msg
        );
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
