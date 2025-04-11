import * as events from './';

import { evaluate, Lazy } from '@quenk/noni/lib/data/lazy';

import { LogWritable } from '../log/writer';
import { Address } from '../../../address';
import { Message } from '../../..';
import { Thread } from '../thread';
import { EventType, InternalEvent } from './';

const eventMap = {
    message: new Map([
        [events.EVENT_MESSGAE_SEND, events.MessageSendEvent],
        [events.EVENT_MESSAGE_CONSUMED, events.MessageConsumeEvent],
        [events.EVENT_MESSAGE_BOUNCE, events.MessageBounceEvent],
        [events.EVENT_MESSAGE_DROPPED, events.MessageDropEvent]
    ]),
    actor: new Map([
        [events.EVENT_ACTOR_ALLOCATED, events.ActorAllocatedEvent],
        [events.EVENT_ACTOR_STARTED, events.ActorStartedEvent],
        [events.EVENT_ACTOR_RECEIVE, events.ActorReceiveEvent],
        [events.EVENT_ACTOR_STOPPED, events.ActorStoppedEvent],
        [events.EVENT_ACTOR_DEALLOCATED, events.ActorDeallocatedEvent]
    ])
};

export const ADDRESS_WILDCARD = '*';

/**
 * Listener is the signature of functions that receive VM events.
 */
export type Listener = (event: InternalEvent) => Promise<void>;

/**
 * ListenerMap maps event types to a list of listeners.
 */
export type ListenerMap = Map<EventType, Listener[]>;

/**
 * EventDispatcher is an interface used by the internal VM components to
 * broadcast interesting events when they occur.
 *
 * This interface is not meant to be used for business logic in an application
 * but rather provides a way to inspect and troubleshoot the VM.  Event dispatch
 * is centralized here to make it clearer what events the system emits.
 *
 * This will also make it easier to disable some events when needed in the
 * future.
 *
 * @typeparam E type of event the dispatcher dispatches.
 */
export class EventDispatcher {
    constructor(
        public log: Lazy<LogWritable>,
        public maps: Map<Address, ListenerMap> = new Map()
    ) {}

    /**
     * addListener queues a callback to be executed when the specified event
     * type occurs for the actor with the target address.
     */
    addListener(actor: Address, type: EventType, listener: Listener) {
        let target = this.maps.get(actor) || new Map();
        let listeners = target.get(type) || [];
        listeners.push(listener);
        target.set(type, listeners);
        this.maps.set(actor, target);
    }

    /**
     * removeListener removes a previously installed listener.
     */
    removeListener(actor: Address, type: EventType, listener: Listener) {
        let target = this.maps.get(actor);
        if (target) {
            let listeners = target.get(type);

            if (listeners) {
                let newListeners = listeners.filter(
                    target => target !== listener
                );
                if (newListeners.length === 0) target.delete(type);
                else target.set(type, newListeners);
            }
            if (target.size === 0) this.maps.delete(actor);
        }
    }

    /**
     * monitor a Thread waiting for a specific event to occur.
     *
     * Where the event is not of type EVENT_ACTOR_STOPPED, the returned promise
     * will reject when the thread stops. This prevents the promise from blocking
     * forever when the actor is killed or runs into an error.
     */
    async monitor(thread: Thread, type: events.EventType) {
        return new Promise<events.InternalEvent>((resolve, reject) => {
            let handler = async (event: events.InternalEvent) => {
                this.removeListener(
                    thread.address,
                    events.EVENT_ACTOR_STOPPED,
                    handler
                );

                this.removeListener(thread.address, type, handler);

                if (event.type === type) {
                    resolve(event);
                } else if (event.type === events.EVENT_ACTOR_STOPPED) {
                    reject(
                        new Error(
                            `[${thread.address}]: ERR_MONITOR_ACTOR_STOPPED`
                        )
                    );
                }
            };

            if (type !== events.EVENT_ACTOR_STOPPED)
                this.addListener(
                    thread.address,
                    events.EVENT_ACTOR_STOPPED,
                    handler
                );

            this.addListener(thread.address, type, handler);
        });
    }

    /**
     * dispatchActorEvent dispatches events related to actor lifecycle.
     */
    async dispatchActorEvent(target: Address, actor: Address, type: EventType) {
        let Cons = eventMap.actor.get(type);
        if (Cons) return this.dispatch(target, new Cons(actor));
    }

    /**
     * dispatchMessageEvent dispatches events related to message sending.
     */
    async dispatchMessageEvent(
        from: Address,
        type: EventType,
        to: Address,
        message: Message
    ) {
        let Cons = eventMap.message.get(type);
        if (Cons) return this.dispatch(from, new Cons(from, to, message));
    }

    /**
     * dispatch is a generic function that when called dispatchs the supplied
     * event to all installed listeners.
     */
    async dispatch(target: Address, event: events.InternalEvent) {
        evaluate(this.log).writeEvent(event);
        let listeners = [
            ...(this.maps.get(target)?.get(event.type) ?? []),
            ...(this.maps.get(ADDRESS_WILDCARD)?.get(event.type) ?? [])
        ];
        for (let listener of listeners) await listener(event);
    }
}
