import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Frame } from '../frame';
import { Level } from './';
export declare const OP_CODE_PUSH_NUM = 1;
export declare const OP_CODE_PUSH_STR = 2;
export declare const OP_CODE_PUSH_TEMP = 3;
/**
 * PushNum pushes a literal number onto the stack.
 */
export declare class PushNum<C extends Context, S extends System<C>> {
    value: number;
    constructor(value: number);
    code: number;
    level: Level;
    exec(e: Executor<C, S>): void;
    toLog(): string;
}
/**
 * PushStr pushes a string from the constants table onto the stack.
 */
export declare class PushStr<C extends Context, S extends System<C>> {
    value: number;
    constructor(value: number);
    code: number;
    level: Level;
    exec(e: Executor<C, S>): void;
    toLog(f: Frame<C, S>): string;
}
/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
export declare class PushTemp<C extends Context, S extends System<C>> {
    value: number;
    constructor(value: number);
    code: number;
    level: Level;
    exec(e: Executor<C, S>): void;
    toLog(f: Frame<C, S>): string;
}
