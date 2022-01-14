import { NewForeignFunInfo, NewFunInfo } from '../system/vm/script/info';
import { BaseScript } from '../system/vm/scripts';
import { Callback } from './immutable/callback';
import { Immutable } from './immutable';
import { Mutable } from './mutable';
/**
 * GenericResidentScript used by resident actors not declared here.
 */
export declare class GenericResidentScript extends BaseScript {
    info: (NewFunInfo | NewForeignFunInfo)[];
}
/**
 * ImmutableActorScript used by Immutable actor instances.
 */
export declare class ImmutableActorScript<T> extends BaseScript {
    actor: Immutable<T>;
    constructor(actor: Immutable<T>);
    info: (NewFunInfo | NewForeignFunInfo)[];
    code: never[];
}
/**
 * CallbackActorScript used by Callback actor instances.
 */
export declare class CallbackActorScript<T> extends BaseScript {
    actor: Callback<T>;
    constructor(actor: Callback<T>);
    info: (NewFunInfo | NewForeignFunInfo)[];
    code: never[];
}
/**
 * MutableActorScript used by Mutable actor instances.
 */
export declare class MutableActorScript extends BaseScript {
    actor: Mutable;
    constructor(actor: Mutable);
    info: (NewFunInfo | NewForeignFunInfo)[];
    code: never[];
}
/**
 * TaskActorScript used by the Task actor.
 */
export declare class TaskActorScript extends BaseScript {
    info: NewFunInfo[];
}
