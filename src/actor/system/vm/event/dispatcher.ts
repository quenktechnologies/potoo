import * as events from './';

import { evaluate, Lazy } from '@quenk/noni/lib/data/lazy';

import { LogWritable } from '../log/writer';
import { Address } from '../../../address';
import { Message } from '../../..';
import { Thread } from '../thread';
import { EventType, InternalEvent } from './';

const eventMap = {
    message: new Map([
        [events.EVENT_MESSAGE_BOUNCE, events.MessageBounceEvent],
        [events.EVENT_MESSGAE_SEND, events.MessageSendEvent]
    ]),
    actor: new Map([
        [events.EVENT_ACTOR_ALLOCATED, events.ActorAllocatedEvent],
        [events.EVENT_ACTOR_STARTED, events.ActorStartedEvent],
        [events.EVENT_ACTOR_STOPPED, events.ActorStoppedEvent],
        [events.EVENT_ACTOR_DEALLOCATED, events.ActorDeallocatedEvent]
    ])
};

export const ADDRESS_WILDCARD = '*';

/**
 * Listener is the signature of functions that receive VM events.
 */
export type Listener = (event: InternalEvent) => void;

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
     * waitListener blocks the caller until the next occurrence of the event
     * type for the target actor.
     */
    async waitListener(
        actor: Address,
        type: EventType
    ): Promise<InternalEvent> {
        return new Promise(resolve => {
            let listener = (e: InternalEvent) => {
                this.removeListener(actor, type, listener);
                resolve(e);
            };
            this.addListener(actor, type, listener);
        });
    }

    /**
     * removeListener removes a previously installed listener.
     */
    removeListener(actor: Address, type: EventType, listener: Listener) {
        let target = this.maps.get(actor);
        if (target) {
            let listeners = target.get(type);
            if (listeners) {
                target.set(
                    type,
                    listeners.filter(target => target !== listener)
                );
            }
        }
    }

    /**
     * dispatchActorEvent dispatches events related to actor lifecycle.
     */
    dispatchActorEvent(thread: Thread, type: EventType) {
        let Cons = eventMap.actor.get(type);
        if (Cons) this.dispatch(thread, new Cons(thread.address));
    }

    /**
     * dispatchMessageEvent dispatches events related to message sending.
     */
    dispatchMessageEvent(
        from: Thread,
        type: EventType,
        to: Address,
        message: Message
    ) {
        let Cons = eventMap.message.get(type);
        if (Cons) this.dispatch(from, new Cons(from.address, to, message));
    }

    /**
     * dispatch is a generic function that when called dispatchs the supplied
     * event to all installed listeners.
     */
    dispatch(thread: Thread, event: events.InternalEvent) {
        evaluate(this.log).writeEvent(event);

        let listeners = [
            ...(this.maps.get(thread.address)?.get(event.type) ?? []),
            ...(this.maps.get(ADDRESS_WILDCARD)?.get(event.type) ?? [])
        ];

        for (let listener of listeners) listener(event);
    }
}
