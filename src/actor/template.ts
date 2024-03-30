import { Err } from '@quenk/noni/lib/control/error';
import { isFunction, Type } from '@quenk/noni/lib/data/type';

import { Actor } from './';
import { Runtime } from './system/vm/runtime';

export const ACTION_RAISE = -0x1;
export const ACTION_IGNORE = 0x0;
export const ACTION_RESTART = 0x1;
export const ACTION_STOP = 0x2;

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
 * Cons is applied to produce an instance of an actor.
 */
export type Cons = (runtime: Runtime) => Actor;

/**
 * DelayMilliseconds type.
 */
export type DelayMilliseconds = number;

/**
 * TrapFunction is applied to errors raised by an actor
 * to determine the action to take.
 */
export type TrapFunc = (e: Err) => TrapAction;

/**
 * Spawnable is anything that can be spawned by an actor.
 */
export type Spawnable = Template | Cons;

/**
 * Templates
 */
export interface Templates {
    [key: string]: Spawnable;
}

/**
 * Template of an actor.
 *
 * Actors are created using templates that describe how to spawn and manage them
 * to the system.
 *
 * The are the minimum amount of information required to create
 * a new actor instance.
 */
export interface Template {
    /**
     * id of the actor used when constructing its address.
     * If none is supplied, the system will generate one.
     */
    id?: string;

    /**
     * group assignment for the actor.
     */
    group?: string | string[];

    /**
     * create function.
     */
    create: Cons;

    /**
     * args are passed to the create function when creating a new instance.
     *
     * This method of passing arguments is not type safe and care should be
     * taken to ensure they are used properly in the create function.
     */
    args?: Type[];

    /**
     * trap is used to take action when the spanwed
     * action encounters an error.
     */
    trap?: TrapFunc;

    /**
     * delay before invoking the actor's run method in milliseconds.
     */
    delay?: DelayMilliseconds;

    /**
     * restart flag indicates whether an actor should be automatically
     * restarted after a normal exit.
     */
    restart?: boolean;

    /**
     * children is list of child actors that will automatically be spawned.
     */
    children?: Templates | Template[];
}

/**
 * fromSpawnable converts a Spawnable to a Template.
 */
export const fromSpawnable = (create: Spawnable): Template =>
    isFunction(create) ? { create } : create;
