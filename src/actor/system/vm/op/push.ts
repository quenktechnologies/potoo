import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Type, Location  } from '../frame';
import { Log, Level } from './';

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

        e.current().get().push(this.index, Type.Number, Location.Literal);

    }

    toLog(): Log {

        return ['pushnum', [this.index, Type.Number, Location.Literal], []];

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

        e.current().get().push(this.index, Type.String, Location.Constants);

    }

    toLog(): Log {

        return ['pushstr', [this.index, Type.String, Location.Constants], []];

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

        e.current().get().push(this.index, Type.Function, Location.Constants);

    }

    toLog(): Log {

        return ['pushfunc', [this.index, Type.Function, Location.Constants], []];

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

        e.current().get().push(this.index, Type.Template, Location.Constants);

    }

    toLog(): Log {

        return ['pushtemp', [this.index, Type.Template, Location.Constants], []];

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

        e.current().get().push(this.index, Type.Message, Location.Constants);

    }

    toLog(): Log {

        return ['pushmsg', [this.index, Type.Message, Location.Constants], []];

    }

}
