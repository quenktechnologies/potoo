import { evaluate, Lazy } from '@quenk/noni/lib/data/lazy';
import { Record } from '@quenk/noni/lib/data/record';

import {
    SharedRunTemplate,
    SpawnConcernLevel,
    SPAWN_CONCERN_ALLOCATED,
    SPAWN_CONCERN_RECEIVING,
    SPAWN_CONCERN_STARTED,
    SPAWN_CONCERN_STOPPED
} from '../../../template';
import {
    EventType,
    EVENT_ACTOR_ALLOCATED,
    EVENT_ACTOR_DEALLOCATED,
    EVENT_ACTOR_RECEIVE,
    EVENT_ACTOR_STARTED,
    EVENT_ACTOR_STOPPED
} from '../event';
import { VM } from '..';
import { Thread } from '.';

const parentEvents = [EVENT_ACTOR_ALLOCATED, EVENT_ACTOR_DEALLOCATED];

const spawnConcerns: Record<EventType> = {
    [SPAWN_CONCERN_ALLOCATED]: EVENT_ACTOR_ALLOCATED,
    [SPAWN_CONCERN_STARTED]: EVENT_ACTOR_STARTED,
    [SPAWN_CONCERN_RECEIVING]: EVENT_ACTOR_RECEIVE,
    [SPAWN_CONCERN_STOPPED]: EVENT_ACTOR_STOPPED
};

const spawnConcern2Event = (level: SpawnConcernLevel) =>
    spawnConcerns[level] ?? EVENT_ACTOR_ALLOCATED;

/**
 * ThreadRunner takes care of starting up actor threads and automatically
 * stopping function actors.
 */
export class ThreadRunner {
    constructor(public vm: Lazy<VM>) {}

    /**
     *
     * waitForConcern produces a promise that can be used to wait for a
     * child thread to acheive a desired concern level.
     *
     * Note: This does not pause the parent thread.
     */
    async waitForConcern(
        parent: Thread,
        child: Thread,
        level: SpawnConcernLevel = SPAWN_CONCERN_ALLOCATED
    ) {
        let { events } = evaluate(this.vm);
        let evt = spawnConcern2Event(level);

        //NOTE: Do not await here otherwise execution will continue before the
        // listener has been installed resulting in the event being missed.
        return parentEvents.includes(evt)
            ? events.monitor(parent, evt)
            : events.monitor(child, evt);
    }

    /**
     * runThread executes a newly allocated child thread.
     *
     * If the template is a function template, the thread will be
     * deallocated after the function completes.
     *
     * Note: This behaviour is not immediate if the the thread has children.
     * In that case we wait until the child threads have been removed.
     * This will not hinder intentional exits.
     */
    async runThread(thread: Thread) {
        let { events, collector } = evaluate(this.vm);

        if ((<SharedRunTemplate>thread.template).run) collector.mark(thread);

        await thread.start();

        await events.dispatchActorEvent(
            thread.address,
            thread.address,
            EVENT_ACTOR_STARTED
        );

        await collector.collect(thread);
    }
}
