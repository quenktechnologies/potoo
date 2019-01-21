import { show } from '@quenk/noni/lib/data/type';
import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import {Type, Location, Frame } from '../frame';
import { Level } from './';

export const OP_CODE_PUSH_NUM = 0x1;
export const OP_CODE_PUSH_STR = 0x2;
export const OP_CODE_PUSH_TEMP = 0x3;

/**
 * PushNum pushes a literal number onto the stack.
 */
export class PushNum<C extends Context, S extends System<C>> {

    constructor(public value: number) { }

    code = OP_CODE_PUSH_NUM;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.value, Type.Number, Location.Literal);

    }

    toLog() {

        return `pushnum ${this.value}`;

    }

}

/**
 * PushStr pushes a string from the constants table onto the stack.
 */
export class PushStr<C extends Context, S extends System<C>> {

    constructor(public value: number) { }

    code = OP_CODE_PUSH_STR;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.value, Type.String, Location.Constants);

    }

    toLog(f: Frame<C, S>): string {

        return `pushstr ${this.value} ` +
            `// ${f.script.constants[Type.String][this.value]}`;

    }

}

/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
export class PushTemp<C extends Context, S extends System<C>> {

    constructor(public value: number) { }

    code = OP_CODE_PUSH_TEMP;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.value, Type.Template,Location.Constants);

    }

    toLog(f: Frame<C, S>): string {

        return `pushtemp ${this.value} ` +
            `// ${show(f.script.constants[Type.Template][this.value])}`;

    }

}
