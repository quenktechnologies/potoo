import { Runtime } from '../runtime';
import { Log, Level, Op } from './';
/**
 * PushNum pushes a literal number onto the stack.
 */
export declare class PushNum implements Op {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}
/**
 * PushStr pushes a string from the constants table onto the stack.
 */
export declare class PushStr implements Op {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}
/**
 * PushFunc pushes a function constant onto the stack.
 */
export declare class PushFunc implements Op {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}
/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
export declare class PushTemp implements Op {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}
/**
 * PushMsg pushes a message constant onto the stack.
 */
export declare class PushMsg implements Op {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}
/**
 * PushForeign pushes a foreign function onto the stack.
 */
export declare class PushForeign implements Op {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}
