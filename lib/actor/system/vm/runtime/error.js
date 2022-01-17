"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownFunErr = exports.UnknownInstanceErr = exports.InvalidFunctionErr = exports.InvalidConstructorErr = exports.MissingInfoErr = exports.InvalidPropertyIndex = exports.StackEmptyErr = exports.IntegerOverflowErr = exports.MissingSymbolErr = exports.UnknownAddressErr = exports.EmptyMailboxErr = exports.NoMailboxErr = exports.NoReceiverErr = exports.IllegalStopErr = exports.UnexpectedDataType = exports.NullPointerErr = exports.JumpOutOfBoundsErr = exports.NullFunctionPointerErr = exports.NullTemplatePointerErr = exports.DuplicateAddressErr = exports.UnknownParentAddressErr = exports.InvalidIdErr = exports.Error = void 0;
const address_1 = require("../../../address");
const frame_1 = require("./stack/frame");
/**
 * Error
 */
class Error {
    constructor(message) {
        this.message = message;
    }
}
exports.Error = Error;
/**
 * InvalidIdError indicates an id used in a template is invalid.
 */
class InvalidIdErr extends Error {
    constructor(id) {
        super(`The id "${id} must not contain` +
            `${address_1.ADDRESS_RESTRICTED} or be an empty string!`);
        this.id = id;
    }
}
exports.InvalidIdErr = InvalidIdErr;
/**
 * UnknownParentAddressErr indicates the parent address used for
 * spawning an actor does not exist.
 */
class UnknownParentAddressErr extends Error {
    constructor(address) {
        super(`The parent address "${address}" is not part of the system!`);
        this.address = address;
    }
}
exports.UnknownParentAddressErr = UnknownParentAddressErr;
/**
 * DuplicateAddressErr indicates the address of a freshly spawned
 * actor is already in use.
 */
class DuplicateAddressErr extends Error {
    constructor(address) {
        super(`Duplicate address "${address}" detected!`);
        this.address = address;
    }
}
exports.DuplicateAddressErr = DuplicateAddressErr;
/**
 * NullTemplatePointerErr occurs when a reference to a template
 * does not exist in the templates table.
 */
class NullTemplatePointerErr extends Error {
    constructor(index) {
        super(`The index "${index}" does not exist in the Template table!`);
        this.index = index;
    }
}
exports.NullTemplatePointerErr = NullTemplatePointerErr;
class NullFunctionPointerErr extends Error {
    constructor(index) {
        super(`The index "${index}" does not exist in the function table!`);
        this.index = index;
    }
}
exports.NullFunctionPointerErr = NullFunctionPointerErr;
/**
 * JumpOutOfBoundsErr
 */
class JumpOutOfBoundsErr extends Error {
    constructor(location, size) {
        super(`Cannot jump to location "${location}"! Max location: ${size}!`);
        this.location = location;
        this.size = size;
    }
}
exports.JumpOutOfBoundsErr = JumpOutOfBoundsErr;
/**
 * NullPointerErr
 */
class NullPointerErr extends Error {
    constructor(data) {
        super(`Value: [${data.toString(16)}]`);
        this.data = data;
    }
}
exports.NullPointerErr = NullPointerErr;
/**
 * UnexpectedDataType
 */
class UnexpectedDataType extends Error {
    constructor(expected, got) {
        super(`Expected: ${expected.toString(16)}, ` +
            `Received: ${got.toString(16)}`);
        this.expected = expected;
        this.got = got;
    }
}
exports.UnexpectedDataType = UnexpectedDataType;
/**
 * IllegalStopErr
 */
class IllegalStopErr extends Error {
    constructor(parent, child) {
        super(`The actor at address "${parent}" can not kill "${child}"!`);
        this.parent = parent;
        this.child = child;
    }
}
exports.IllegalStopErr = IllegalStopErr;
/**
 * NoReceiverErr
 */
class NoReceiverErr extends Error {
    constructor(actor) {
        super(`Actor ${actor} tried to read a message without a receiver!`);
        this.actor = actor;
    }
}
exports.NoReceiverErr = NoReceiverErr;
/**
 * NoMailboxErr
 */
class NoMailboxErr extends Error {
    constructor(actor) {
        super(`Actor ${actor} has no mailbox!`);
        this.actor = actor;
    }
}
exports.NoMailboxErr = NoMailboxErr;
/**
 * EmptyMailboxErr
 */
class EmptyMailboxErr extends Error {
    constructor() {
        super('Mailbox empty.');
    }
}
exports.EmptyMailboxErr = EmptyMailboxErr;
/**
 * UnknownAddressErr
 */
class UnknownAddressErr extends Error {
    constructor(actor) {
        super(`The system has no actor for address "${actor}"!`);
        this.actor = actor;
    }
}
exports.UnknownAddressErr = UnknownAddressErr;
/**
 * MissingSymbolErr
 */
class MissingSymbolErr extends Error {
    constructor(index) {
        super(`Cannot locate symbol at index 0x${index.toString(16)}`);
        this.index = index;
    }
}
exports.MissingSymbolErr = MissingSymbolErr;
/**
 * IntegerOverflowErr
 */
class IntegerOverflowErr extends Error {
    constructor() {
        super(`DATA_MAX_SAFE_UINT32=${frame_1.DATA_MAX_SAFE_UINT32}`);
    }
}
exports.IntegerOverflowErr = IntegerOverflowErr;
/**
 * StackEmptyErr
 */
class StackEmptyErr extends Error {
    constructor() {
        super('Stack is empty.');
    }
}
exports.StackEmptyErr = StackEmptyErr;
/**
 * InvalidPropertyIndex
 */
class InvalidPropertyIndex extends Error {
    constructor(cons, idx) {
        super(`Constructor: ${cons.name}, index: ${idx}`);
        this.cons = cons;
        this.idx = idx;
    }
}
exports.InvalidPropertyIndex = InvalidPropertyIndex;
/**
 * MissingInfoErr
 */
class MissingInfoErr extends Error {
    constructor(idx) {
        super(`No info object index: ${idx}!`);
        this.idx = idx;
    }
}
exports.MissingInfoErr = MissingInfoErr;
/**
 * InvalidConstructorErr
 */
class InvalidConstructorErr extends Error {
    constructor(name) {
        super(`Named object "${name}" cannot be used as a constructor!`);
        this.name = name;
    }
}
exports.InvalidConstructorErr = InvalidConstructorErr;
/**
 * InvalidFunctionErr
 */
class InvalidFunctionErr extends Error {
    constructor(name) {
        super(`Named object "${name}" cannot be used as a function!`);
        this.name = name;
    }
}
exports.InvalidFunctionErr = InvalidFunctionErr;
/**
 * UnknownInstanceErr
 */
class UnknownInstanceErr extends Error {
    constructor(instance) {
        super('The instance provided with constructor ' +
            (instance ? instance.constructor.name || instance : instance) +
            '" is not in the system!');
        this.instance = instance;
    }
}
exports.UnknownInstanceErr = UnknownInstanceErr;
/**
 * UnknownFuncErr
 */
class UnknownFunErr extends Error {
    constructor(name) {
        super(`The function '${name}' does not exist and cannot be executed!`);
        this.name = name;
    }
}
exports.UnknownFunErr = UnknownFunErr;
//# sourceMappingURL=error.js.map