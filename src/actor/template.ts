import { Err } from '@quenk/noni/lib/control/error';
import { isFunction } from '@quenk/noni/lib/data/type';

import { Runtime } from './system/vm/runtime';
import { Actor } from './';

export const ACTION_RAISE = -0x1;
export const ACTION_IGNORE = 0x0;
export const ACTION_RESTART = 0x1;
export const ACTION_STOP = 0x2;

/**
 * TrapFunc is applied to unhandled errors raised by an actor.
 *
 * The result determines the action to take.
 */
export type TrapFunc = (e: Err) => TrapAction;

/**
 * TrapAction represents each one of the actions that can be taken after
 * an error has been trapped.
 *
 * These are:
 *
 * 1. Raise an error (to the actor's parent).
 * 2. Ignore the error (effectively continuing as though nothing happened).
 * 3. Restart the actor.
 * 4. Stop the actor and eject it from the system.
 */
export type TrapAction = -0x1 | 0x0 | 0x1 | 0x2;

/**
 * ActorOption is a type that may contain an Actor or not.
 */
export type ActorOption = Actor | void;

/**
 * CreateFunc receives a handle to the actor's resources and may optionally
 * provide an object to serve as the actor within the system.
 */
export type CreateFunc = (
    runtime: Runtime
) => ActorOption | Promise<ActorOption>;

/**
 * Spawnable allows a CreateFunc to be used in place of a Template.
 */
export type Spawnable = Template | CreateFunc;

/**
 * Template is an object that tells the system how to create an manage an
 * actor.
 *
 * Every actor in the system is created from an initial template that is reused
 * if the actor needs to be restarted.
 */
export interface Template {
    /**
     * id of the actor used when constructing its address.
     *
     * Ids must be unique among the children of an actor but not necessary at
     * the system level.
     *
     * If no id is supplied the system will generate one.
     */
    id?: string;

    /**
     * group assignment for the actor.
     *
     * Including an actor in a group allows for messages to be sent to one
     * address but received by multiple actors.
     */
    group?: string | string[];

    /**
     * create is called at the point the actor's resources have been allocated.
     *
     * If an implementer of Actor is returned, it is used as the actor in the
     * system.
     */
    create: CreateFunc;

    /**
     * trap is called when unhandled errors are detected.
     *
     * The result of this function determines the next action to take.
     */
    trap?: TrapFunc;
}

/**
 * fromSpawnable converts a Spawnable to a Template.
 */
export const fromSpawnable = (create: Spawnable): Template =>
    isFunction(create) ? { create } : create;
