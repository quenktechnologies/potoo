import { Address, ADDRESS_RESTRICTED } from '../../../address';

/**
 * Error
 */
export class Error {

    constructor(public message: string) { }

}

/**
 * InvalidIdError indicates an id used in a template is invalid.
 */
export class InvalidIdErr extends Error {

    constructor(public id: string) {

        super(`The id "${id} must not contain` +
            `${ADDRESS_RESTRICTED} or be an empty string!`);

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

    constructor(public location: number, public size: number) {

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

export class TypeErr extends Error {

    constructor(public expected: number, public got: number) {

        super(`Expected: ${expected}, Received: ${got}`);

    }

}

/**
 * IllegalStopErr
 */
export class IllegalStopErr extends Error {

    constructor(public parent: string, public child: string) {

        super(`The actor at address "${parent}" can not kill "${child}"!`);

    }

}

/**
 * NoReceiveErr
 */
export class NoReceiveErr extends Error {

    constructor(public actor: string) {

        super(`Actor ${actor} tried to read without a handler!`);

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

    constructor(public actor: string) {

        super(`Actor ${actor} 's mailbox is empty!`);

    }

}
