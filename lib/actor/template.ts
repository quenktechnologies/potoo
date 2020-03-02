import { mapTo, merge, isRecord } from '@quenk/noni/lib/data/record';
import { Err } from '@quenk/noni/lib/control/error';
import { Type } from '@quenk/noni/lib/data/type';

import { System } from './system';
import { Context } from './context';
import { Actor } from './';
import { randomID } from './address';

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
export type Cons<S extends System> = (s: S, ...args: Type[]) => Actor<Context>;

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
export type Spawnable<S extends System> = Template<S> | Cons<S>;

/**
 * Templates
 */
export interface Templates<S extends System> {

    [key: string]: Spawnable<S>

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
export interface Template<S extends System> {

    /**
     * id of the actor used when constructing its address.
     * If none is supplied, the system will generate one.
     */
    id?: string;

    /** 
     * group assignment for the actor.
     */
    group?: string | string[],

    /**
     * create function.
     */
    create: Cons<S>;

    /**
     * args are passed to the create function when creating a new instance.
     *
     * This method of passing arguments is not type safe and care should be
     * taken to ensure they are used properly in the create function.
     */
    args?: Type[],

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
    restart?: boolean

    /**
     * children is list of child actors that will automatically be spawned.
     */
    children?: Templates<S> | Template<S>[]

}

/**
 * normalize a Template so that its is easier to work with.
 */
export const normalize = <S extends System>(t: Template<S>) => merge(t, {

    id: t.id ? t.id : randomID(),

    children: isRecord(t.children) ?
        mapTo(t.children, (c, k) => merge(c, { id: k })) : t.children

})
