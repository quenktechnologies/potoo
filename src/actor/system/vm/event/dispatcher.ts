import * as events from './';

import { evaluate, Lazy } from '@quenk/noni/lib/data/lazy';

import { LogWritable } from '../log/writer';
import { Address } from '../../../address';
import { Message } from '../../..';
import { EventType, InternalEvent } from './';

/**
 * Handler is the type of function that receives events.
 */
export type Handler = (event: InternalEvent) => void;

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
        public handlers: Map<EventType, Handler[]> = new Map()
    ) {}

    /**
     * addListener to the EventDispatcher.
     */
    addEventListener(type: EventType, handler: Handler) {
        let handlers = this.handlers.get(type) || [];
        handlers.push(handler);
        this.handlers.set(type, handlers);
    }

    /**
     * dispatchMessageEvent dispatches events related to message sending.
     */
    dispatchMessageEvent(
        type: EventType,
        from: Address,
        to: Address,
        message: Message
    ) {
        let Cons = eventMap.message.get(type);
        if (Cons) this.dispatch(new Cons(from, to, message));
    }

    /**
     * dispatchActorEvent dispatches events related to actor lifecycle.
     */
    dispatchActorEvent(type: EventType, actor: Address) {
        let Cons = eventMap.actor.get(type);
        if (Cons) this.dispatch(new Cons(actor));
    }

    /**
     * dispatch is a generic function that when called will create and dispatch
     * the event the EventDispatcher is responsible for.
     */
    dispatch(event: events.InternalEvent) {
        evaluate(this.log).writeEvent(event);
        for (let handler of this.handlers.get(event.type) || []) handler(event);
    }
}
