import { Address, ADDRESS_RESTRICTED } from '../../../address';
import { TypeInfo } from '../script/info';
import { DATA_MAX_SAFE_UINT32 } from '../frame';
import { Thread } from '../thread';

/**
 * Error
 */
export class Error {
    constructor(public message: string) {}
}

/**
 * InvalidIdError indicates an id used in a template is invalid.
 */
export class InvalidIdErr extends Error {
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
export class UnknownParentAddressErr extends Error {
    constructor(public address: Address) {
        super(`The parent address "${address}" is not part of the system!`);
    }
}

/**
 * DuplicateAddressErr indicates the address of a freshly spawned
 * actor is already in use.
 */
export class DuplicateAddressErr extends Error {
    constructor(public address: Address) {
        super(`Duplicate address "${address}" detected!`);
    }
}

/**
 * NullTemplatePointerErr occurs when a reference to a template
 * does not exist in the templates table.
 */
export class NullTemplatePointerErr extends Error {
    constructor(public index: number) {
        super(`The index "${index}" does not exist in the Template table!`);
    }
}

export class NullFunctionPointerErr extends Error {
    constructor(public index: number) {
        super(`The index "${index}" does not exist in the function table!`);
    }
}

/**
 * JumpOutOfBoundsErr
 */
export class JumpOutOfBoundsErr extends Error {
    constructor(
        public location: number,
        public size: number
    ) {
        super(`Cannot jump to location "${location}"! Max location: ${size}!`);
    }
}

/**
 * NullPointerErr
 */
export class NullPointerErr extends Error {
    constructor(public data: number) {
        super(`Value: [${data.toString(16)}]`);
    }
}

/**
 * UnexpectedDataType
 */
export class UnexpectedDataType extends Error {
    constructor(
        public expected: number,
        public got: number
    ) {
        super(
            `Expected: ${expected.toString(16)}, ` +
                `Received: ${got.toString(16)}`
        );
    }
}

/**
 * IllegalStopErr
 */
export class IllegalStopErr extends Error {
    constructor(
        public parent: string,
        public child: string
    ) {
        super(`The actor at address "${parent}" can not kill "${child}"!`);
    }
}

/**
 * NoReceiverErr
 */
export class NoReceiverErr extends Error {
    constructor(public actor: string) {
        super(`Actor ${actor} tried to read a message without a receiver!`);
    }
}

/**
 * NoMailboxErr
 */
export class NoMailboxErr extends Error {
    constructor(public actor: string) {
        super(`Actor ${actor} has no mailbox!`);
    }
}

/**
 * EmptyMailboxErr
 */
export class EmptyMailboxErr extends Error {
    constructor() {
        super('Mailbox empty.');
    }
}

/**
 * UnknownAddressErr
 */
export class UnknownAddressErr extends Error {
    constructor(public actor: string) {
        super(`The system has no actor for address "${actor}"!`);
    }
}

/**
 * MissingSymbolErr
 */
export class MissingSymbolErr extends Error {
    constructor(public index: number) {
        super(`Cannot locate symbol at index 0x${index.toString(16)}`);
    }
}

/**
 * IntegerOverflowErr
 */
export class IntegerOverflowErr extends Error {
    constructor() {
        super(`DATA_MAX_SAFE_UINT32=${DATA_MAX_SAFE_UINT32}`);
    }
}

/**
 * StackEmptyErr
 */
export class StackEmptyErr extends Error {
    constructor() {
        super('Stack is empty.');
    }
}

/**
 * InvalidPropertyIndex
 */
export class InvalidPropertyIndex extends Error {
    constructor(
        public cons: TypeInfo,
        public idx: number
    ) {
        super(`Constructor: ${cons.name}, index: ${idx}`);
    }
}

/**
 * MissingInfoErr
 */
export class MissingInfoErr extends Error {
    constructor(public idx: number) {
        super(`No info object index: ${idx}!`);
    }
}

/**
 * InvalidConstructorErr
 */
export class InvalidConstructorErr extends Error {
    constructor(public name: string) {
        super(`Named object "${name}" cannot be used as a constructor!`);
    }
}

/**
 * InvalidFunctionErr
 */
export class InvalidFunctionErr extends Error {
    constructor(public name: string) {
        super(`Named object "${name}" cannot be used as a function!`);
    }
}

/**
 * UnknownInstanceErr
 */
export class UnknownInstanceErr extends Error {
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
export class UnknownFunErr extends Error {
    constructor(public name: string) {
        super(`The function '${name}' does not exist and cannot be executed!`);
    }
}

/**
 * InvalidThreadErr
 */
export class InvalidThreadErr extends Error {
    constructor(public thread: Thread) {
        super('Thread is no longer part of the system or is invalid!');
    }
}
