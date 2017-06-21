import { Context } from './Context';
import { System } from './System';

/**
 * Template represents the minimum amount of information required to create
 * a new actor instance.
 */
export abstract class Template {

    constructor(public id: string) { }

    abstract create(path: string, s: System): Context

};
