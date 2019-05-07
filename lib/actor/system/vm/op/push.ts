import { Runtime } from '../runtime';
import { Type, Location } from '../frame';
import {
    OP_CODE_PUSH_NUM,
    OP_CODE_PUSH_STR,
    OP_CODE_PUSH_FUNC,
    OP_CODE_PUSH_TEMP,
    OP_CODE_PUSH_MSG,
    OP_CODE_PUSH_FOREIGN,
    Log,
    Level,
    Op
} from './';

/**
 * PushNum pushes a literal number onto the stack.
 */
export class PushNum implements Op {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_NUM;

    level = Level.Base;

    exec(e: Runtime): void {

        e.current().get().push(this.index, Type.Number, Location.Literal);

    }

    toLog(): Log {

        return ['pushnum', [this.index, Type.Number, Location.Literal], []];

    }

}

/**
 * PushStr pushes a string from the constants table onto the stack.
 */
export class PushStr implements Op {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_STR;

    level = Level.Base;

    exec(e: Runtime): void {

        e.current().get().push(this.index, Type.String, Location.Constants);

    }

    toLog(): Log {

        return ['pushstr', [this.index, Type.String, Location.Constants], []];

    }

}

/**
 * PushFunc pushes a function constant onto the stack.
 */
export class PushFunc implements Op {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_FUNC;

    level = Level.Base;

    exec(e: Runtime): void {

        e.current().get().push(this.index, Type.Function, Location.Constants);

    }

    toLog(): Log {

        return ['pushfunc', [this.index, Type.Function, Location.Constants], []];

    }

}

/**
 * PushTemp pushes a template from the constants table onto the stack.
 */
export class PushTemp implements Op {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_TEMP;

    level = Level.Base;

    exec(e: Runtime): void {

        e.current().get().push(this.index, Type.Template, Location.Constants);

    }

    toLog(): Log {

        return ['pushtemp', [this.index, Type.Template, Location.Constants], []];

    }

}

/**
 * PushMsg pushes a message constant onto the stack.
 */
export class PushMsg implements Op {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_MSG;

    level = Level.Base;

    exec(e: Runtime): void {

        e.current().get().push(this.index, Type.Message, Location.Constants);

    }

    toLog(): Log {

        return ['pushmsg', [this.index, Type.Message, Location.Constants], []];

    }

}

/**
 * PushForeign pushes a foreign function onto the stack.
 */
export class PushForeign implements Op {

    constructor(public index: number) { }

    code = OP_CODE_PUSH_FOREIGN;

    level = Level.Base;

    exec(e: Runtime): void {

        e.current().get().push(this.index, Type.Foreign, Location.Constants);

    }

    toLog(): Log {

        return ['pushforeign', [this.index, Type.Foreign, Location.Constants], []];

    }

}
