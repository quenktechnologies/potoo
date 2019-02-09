import { Context } from '../../../context';
import { Runtime } from '../runtime';
import { System } from '../../';
import { Log, Level } from './';
/**
 * PushNum pushes a literal number onto the stack.
 */
export declare class PushNum<C extends Context, S extends System<C>> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
/**
 * PushStr pushes a string from the constants table onto the stack.
 */
export declare class PushStr<C extends Context, S extends System<C>> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
/**
 * PushFunc pushes a function constant onto the stack.
 */
export declare class PushFunc<C extends Context, S extends System<C>> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
export declare class PushTemp<C extends Context, S extends System<C>> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
/**
 * PushMsg pushes a message constant onto the stack.
 */
export declare class PushMsg<C extends Context, S extends System<C>> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
/**
 * PushForeign pushes a foreign function onto the stack.
 */
export declare class PushForeign<C extends Context, S extends System<C>> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
