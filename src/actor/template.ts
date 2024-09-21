import { Path } from '@quenk/noni/lib/data/record/path';
import { Record } from '@quenk/noni/lib/data/record';
import { Err } from '@quenk/noni/lib/control/error';
import { isFunction, isString } from '@quenk/noni/lib/data/type';

import { Runtime } from './system/vm/runtime';
import { Actor } from './';
import {
    EventType,
    EVENT_ACTOR_ALLOCATED,
    EVENT_ACTOR_RECEIVE,
    EVENT_ACTOR_STARTED,
    EVENT_ACTOR_STOPPED
} from './system/vm/event';

export const ACTION_RAISE = -0x1;
export const ACTION_IGNORE = 0x0;
export const ACTION_RESTART = 0x1;
export const ACTION_STOP = 0x2;

/**
 * TemplateType is the type of actor to create.
 */
export type TemplateType = string;

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
 * SpawnConcernLevel is one of the CONCERN_LEVEL_* constants.
 */
export type SpawnConcernLevel = string;

/**
 * BaseTemplate holds the common properties for all templates.
 */
export interface BaseTemplate {
    /**
     * type indicates the type of template and thus the type of thread that
     * will be allocated for the actor.
     *
     * Defaults to 'shared' if not specified.
     */
    type?: TemplateType;

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
     * spawnConcern indicates which event from the actor should be waited
     * on before the parent considers it spawned.
     *
     * If not specified, the default is to wait for the allocated event.
     */
    spawnConcern?: SpawnConcernLevel;

    /**
     * trap is called when unhandled errors are detected.
     *
     * The result of this function determines the next action to take.
     */
    trap?: TrapFunc;
}

/**
 * CreateFunc is a function that creates an actor given the handle the system
 * has generated.
 *
 * Use it when a class based actor implementation is preffered.
 */
export type CreateFunc = (runtime: Runtime) => Actor;

/**
 * RunFunc serves as the main function for function based actors.
 *
 * This should only ever be a function declared with the "async" keyword and
 * not just a function that returns a Promise.
 */
export type RunFunc = (runtime: Runtime) => Promise<void>;

/**
 * Template is an object that tells the system how to create an manage an
 * actor.
 *
 * Every actor in the system is created from an initial template that is reused
 * if the actor needs to be restarted. The type of template determines the
 * type of thread that will be allocated for the actor.
 */
export type Template = SharedTemplate | ProcessTemplate;

/**
 * SharedTemplate is used for resident actors that require a SharedThread to
 * be allocated.
 */
export type SharedTemplate = SharedCreateTemplate | SharedRunTemplate;

/**
 * SharedCreateTemplate is used for class based actors.
 */
export interface SharedCreateTemplate extends BaseTemplate {
    /**
     * create an instance of the actor to be used within the system.
     */
    create: CreateFunc;
}

/**
 * SharedRunTemplate is used for function based actors.
 */
export interface SharedRunTemplate extends BaseTemplate {
    /**
     * run is called to run a function based actor.
     */
    run: RunFunc;
}

/**
 * ProcessTemplate is used for creating child process actors.
 */
export interface ProcessTemplate extends BaseTemplate {
    /**
     * script is the path to the script that will be executed in the child
     * process.
     */
    script: Path;
}

/**
 * Spawnable allows a CreateFunc to be used in place of a Template.
 */
export type Spawnable = Template | CreateFunc | RunFunc;

const AsyncFunction = (async () => {}).constructor;

const isAsyncFunction = (func: Function) => func.constructor === AsyncFunction;

/**
 * isProcessTemplate test.
 */
export const isProcessTemplate = (tmpl: Template): tmpl is ProcessTemplate =>
    isString((<ProcessTemplate>tmpl).script);

/**
 * fromSpawnable converts a Spawnable to a Template.
 *
 * If a function is supplied we assume a SharedTemplate is desired.
 *
 * NOTE: That this requires a runtime that has an AsyncFunction constructor
 * in global scope in order to work properly.
 */
export const fromSpawnable = (tmpl: Spawnable): Template => {
    if (isFunction(tmpl)) {
        return isAsyncFunction(tmpl)
            ? { run: <RunFunc>tmpl }
            : { create: <CreateFunc>tmpl };
    } else {
        return tmpl;
    }
};

export const SPAWN_CONCERN_ALLOCATED = 'allocated';
export const SPAWN_CONCERN_STARTED = 'started';
export const SPAWN_CONCERN_RECEIVING = 'receiving';
export const SPAWN_CONCERN_STOPPED = 'stopped';

const spawnConcerns: Record<EventType> = {
    [SPAWN_CONCERN_ALLOCATED]: EVENT_ACTOR_ALLOCATED,
    [SPAWN_CONCERN_STARTED]: EVENT_ACTOR_STARTED,
    [SPAWN_CONCERN_RECEIVING]: EVENT_ACTOR_RECEIVE,
    [SPAWN_CONCERN_STOPPED]: EVENT_ACTOR_STOPPED
};

/**
 * spawnConcern2Event converts a SpawnConcernLevel to an EventType.
 */
export const spawnConcern2Event = (
    level: SpawnConcernLevel = 'allocated'
): EventType => spawnConcerns[level] ?? EVENT_ACTOR_ALLOCATED;
