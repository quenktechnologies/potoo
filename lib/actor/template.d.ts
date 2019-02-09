import { Err } from '@quenk/noni/lib/control/error';
import { System } from './system';
import { Context } from './context';
import { Actor } from './';
export declare const ACTION_RAISE = -1;
export declare const ACTION_IGNORE = 0;
export declare const ACTION_RESTART = 1;
export declare const ACTION_STOP = 2;
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
export declare type TrapAction = -0x1 | 0x0 | 0x1 | 0x2;
/**
 * Cons is applied to produce an instance of an actor.
 */
export declare type Cons<C extends Context, S extends System<C>> = (s: S) => Actor<C>;
/**
 * DelayMilliseconds type.
 */
export declare type DelayMilliseconds = number;
/**
 * TrapFunction is applied to errors raised by an actor
 * to determine the action to take.
 */
export declare type TrapFunc = (e: Err) => TrapAction;
/**
 * Template of an actor.
 *
 * Actors are created using templates that describe how to spawn and manage them
 * to the system.
 *
 * The are the minimum amount of information required to create
 * a new actor instance.
 */
export interface Template<C extends Context, S extends System<C>> {
    /**
     * id of the actor used when constructing its address.
     */
    id: string;
    /**
     * create function.
     */
    create: Cons<C, S>;
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
    children?: Template<C, S>[];
}
