import { show } from '@quenk/noni/lib/data/type';
import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Type, Location, Frame } from '../frame';
import { Level } from './';

export const OP_CODE_PUSH_NUM = 0x1;
export const OP_CODE_PUSH_STR = 0x2;
export const OP_CODE_PUSH_FUNC = 0x3;
export const OP_CODE_PUSH_TEMP = 0x4;
export const OP_CODE_PUSH_MSG = 0x5;

/**
 * PushNum pushes a literal number onto the stack.
 */
export class PushNum<C extends Context, S extends System<C>> {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_NUM;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.index, Type.Number, Location.Literal);

    }

    toLog() {

        return `pushnum ${this.index}`;

    }

}

/**
 * PushStr pushes a string from the constants table onto the stack.
 */
export class PushStr<C extends Context, S extends System<C>> {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_STR;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.index, Type.String, Location.Constants);

    }

    toLog(f: Frame<C, S>): string {

        return `pushstr ${this.index} ` +
            `// ${f.script.constants[Type.String][this.index]}`;

    }

}

/**
 * PushFunc pushes a function constant onto the stack.
 */
export class PushFunc<C extends Context, S extends System<C>> {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_FUNC;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.index, Type.Function, Location.Constants);

    }

    toLog(): string {

        return `pushfunc ${this.index}`;

    }

}

/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
export class PushTemp<C extends Context, S extends System<C>> {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_TEMP;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.index, Type.Template, Location.Constants);

    }

    toLog(f: Frame<C, S>): string {

        return `pushtemp ${this.index} ` +
            `// ${show(f.script.constants[Type.Template][this.index])}`;

    }

}

/**
 * PushMsg pushes a message constant onto the stack.
 */
export class PushMsg<C extends Context, S extends System<C>> {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_MSG;

    level = Level.Base;

    exec(e: Executor<C, S>): void {

        e.current.push(this.index, Type.Message, Location.Constants);

    }

    toLog(): string {

        return `pushmessage ${this.index}`;

    }

}
