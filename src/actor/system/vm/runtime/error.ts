import { Err } from '@quenk/noni/lib/control/err';

import { Address, ADDRESS_RESTRICTED } from '../../../address';
import { TypeInfo } from '../script/info';
import { DATA_MAX_SAFE_UINT32 } from '../frame';
import { Thread } from '../thread';

/**
 * ErrorClass
 */
export class ErrorClass {
    constructor(public message: string) {}

    stack?: string;
}

/**
 * InvalidIdError indicates an id used in a template is invalid.
 */
export class InvalidIdErr extends ErrorClass {
    constructor(public id: string) {
        super(
            `The id "${id} must not contain` +
                `${ADDRESS_RESTRICTED} or be an empty string!`
        );
    }
}

/**
 * UnknownParentAddressErr indicates the parent address used for
 * spawning an actor does not exist.
 */
export class UnknownParentAddressErr extends ErrorClass {
    constructor(public address: Address) {
        super(`The parent address "${address}" is not part of the system!`);
    }
}

/**
 * DuplicateAddressErr indicates the address of a freshly spawned
 * actor is already in use.
 */
export class DuplicateAddressErr extends ErrorClass {
    constructor(public address: Address) {
        super(`Duplicate address "${address}" detected!`);
    }
}

/**
 * NullTemplatePointerErr occurs when a reference to a template
 * does not exist in the templates table.
 */
export class NullTemplatePointerErr extends ErrorClass {
    constructor(public index: number) {
        super(`The index "${index}" does not exist in the Template table!`);
    }
}

export class NullFunctionPointerErr extends ErrorClass {
    constructor(public index: number) {
        super(`The index "${index}" does not exist in the function table!`);
    }
}

/**
 * JumpOutOfBoundsErr
 */
export class JumpOutOfBoundsErr extends ErrorClass {
    constructor(public location: number, public size: number) {
        super(`Cannot jump to location "${location}"! Max location: ${size}!`);
    }
}

/**
 * NullPointerErr
 */
export class NullPointerErr extends ErrorClass {
    constructor(public data: number) {
        super(`Value: [${data.toString(16)}]`);
    }
}

/**
 * UnexpectedDataType
 */
export class UnexpectedDataType extends ErrorClass {
    constructor(public expected: number, public got: number) {
        super(
            `Expected: ${expected.toString(16)}, ` +
                `Received: ${got.toString(16)}`
        );
    }
}

/**
 * IllegalStopErr
 */
export class IllegalStopErr extends ErrorClass {
    constructor(public parent: string, public child: string) {
        super(`The actor at address "${parent}" can not kill "${child}"!`);
    }
}

/**
 * NoReceiverErr
 */
export class NoReceiverErr extends ErrorClass {
    constructor(public actor: string) {
        super(`Actor ${actor} tried to read a message without a receiver!`);
    }
}

/**
 * NoMailboxErr
 */
export class NoMailboxErr extends ErrorClass {
    constructor(public actor: string) {
        super(`Actor ${actor} has no mailbox!`);
    }
}

/**
 * EmptyMailboxErr
 */
export class EmptyMailboxErr extends ErrorClass {
    constructor() {
        super('Mailbox empty.');
    }
}

/**
 * UnknownAddressErr
 */
export class UnknownAddressErr extends ErrorClass {
    constructor(public actor: string) {
        super(`The system has no actor for address "${actor}"!`);
    }
}

/**
 * MissingSymbolErr
 */
export class MissingSymbolErr extends ErrorClass {
    constructor(public index: number) {
        super(`Cannot locate symbol at index 0x${index.toString(16)}`);
    }
}

/**
 * IntegerOverflowErr
 */
export class IntegerOverflowErr extends ErrorClass {
    constructor() {
        super(`DATA_MAX_SAFE_UINT32=${DATA_MAX_SAFE_UINT32}`);
    }
}

/**
 * StackEmptyErr
 */
export class StackEmptyErr extends ErrorClass {
    constructor() {
        super('Stack is empty.');
    }
}

/**
 * InvalidPropertyIndex
 */
export class InvalidPropertyIndex extends ErrorClass {
    constructor(public cons: TypeInfo, public idx: number) {
        super(`Constructor: ${cons.name}, index: ${idx}`);
    }
}

/**
 * MissingInfoErr
 */
export class MissingInfoErr extends ErrorClass {
    constructor(public idx: number) {
        super(`No info object index: ${idx}!`);
    }
}

/**
 * InvalidConstructorErr
 */
export class InvalidConstructorErr extends ErrorClass {
    constructor(public name: string) {
        super(`Named object "${name}" cannot be used as a constructor!`);
    }
}

/**
 * InvalidFunctionErr
 */
export class InvalidFunctionErr extends ErrorClass {
    constructor(public name: string) {
        super(`Named object "${name}" cannot be used as a function!`);
    }
}

/**
 * UnknownInstanceErr
 */
export class UnknownInstanceErr extends ErrorClass {
    constructor(public instance: object) {
        super(
            'The instance provided with constructor "' +
                (instance ? instance.constructor.name || instance : instance) +
                '" is not in the system!'
        );
    }
}

/**
 * UnknownFuncErr
 */
export class UnknownFunErr extends ErrorClass {
    constructor(public name: string) {
        super(`The function '${name}' does not exist and cannot be executed!`);
    }
}

/**
 * InvalidThreadErr
 */
export class InvalidThreadErr extends ErrorClass {
    constructor(public thread: Thread) {
        super('Thread is no longer part of the system or is invalid!');
    }
}

/**
 * ActorTerminatedErr
 *
 * Note: This signals that an actor has been removed involuntarily due to an
 * unhandled error.
 */
export class ActorTerminatedErr extends Error {
    constructor(
        public actor: Address,
        public origin: Address,
        public originalError: Err
    ) {
        super('ActorTerminated');
    }
}
