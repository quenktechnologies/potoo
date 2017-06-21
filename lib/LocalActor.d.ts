import { LocalContext } from './LocalContext';
import { Template as AbstractTemplate } from './Template';
import { Behaviour } from './Behaviour';
import { Context } from './Context';
import { System } from './System';
/**
 * Template is a template for creating a local actor.
 * @property {string} id
 * @property {function} start
 */
export declare class Template extends AbstractTemplate {
    id: string;
    actorFn: (c: LocalContext) => LocalActor;
    constructor(id: string, actorFn: (c: LocalContext) => LocalActor);
    /**
     * from constructs a new Template using the specified parameters.
     */
    static from(id: string, fn: (c: LocalContext) => LocalActor): Template;
    create(path: string, s: System): Context;
}
/**
 * LocalActor
 */
export declare class LocalActor {
    context: LocalContext;
    constructor(context: LocalContext);
    run(): void;
    spawn(t: Template): string;
    tell<M>(ref: string, m: M): void;
    ask<M>(ref: string, m: M): Promise<{}>;
    receive(b: Behaviour): void;
}
