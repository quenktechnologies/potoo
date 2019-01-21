import { Address, ADDRESS_RESTRICTED } from '../../address';

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

    constructor(public location: number) {

        super(`Cannot jump to location "${location}"!`);

    }

}

export class NullPointerErr extends Error {

    constructor(public data: number[]) {

        super(`Reference: ${data}`);

    }

}

export class TypeErr extends Error {

  constructor(public expected:number, public got:number) {

    super(`Expected: ${expected}, Received: ${got}`);

  }

}
