import { Address } from '../../../address';
import { TypeInfo } from '../script/info';
/**
 * Error
 */
export declare class Error {
    message: string;
    constructor(message: string);
}
/**
 * InvalidIdError indicates an id used in a template is invalid.
 */
export declare class InvalidIdErr extends Error {
    id: string;
    constructor(id: string);
}
/**
 * UnknownParentAddressErr indicates the parent address used for
 * spawning an actor does not exist.
 */
export declare class UnknownParentAddressErr extends Error {
    address: Address;
    constructor(address: Address);
}
/**
 * DuplicateAddressErr indicates the address of a freshly spawned
 * actor is already in use.
 */
export declare class DuplicateAddressErr extends Error {
    address: Address;
    constructor(address: Address);
}
/**
 * NullTemplatePointerErr occurs when a reference to a template
 * does not exist in the templates table.
 */
export declare class NullTemplatePointerErr extends Error {
    index: number;
    constructor(index: number);
}
export declare class NullFunctionPointerErr extends Error {
    index: number;
    constructor(index: number);
}
/**
 * JumpOutOfBoundsErr
 */
export declare class JumpOutOfBoundsErr extends Error {
    location: number;
    size: number;
    constructor(location: number, size: number);
}
/**
 * NullPointerErr
 */
export declare class NullPointerErr extends Error {
    data: number;
    constructor(data: number);
}
/**
 * UnexpectedDataType
 */
export declare class UnexpectedDataType extends Error {
    expected: number;
    got: number;
    constructor(expected: number, got: number);
}
/**
 * IllegalStopErr
 */
export declare class IllegalStopErr extends Error {
    parent: string;
    child: string;
    constructor(parent: string, child: string);
}
/**
 * NoReceiverErr
 */
export declare class NoReceiverErr extends Error {
    actor: string;
    constructor(actor: string);
}
/**
 * NoMailboxErr
 */
export declare class NoMailboxErr extends Error {
    actor: string;
    constructor(actor: string);
}
/**
 * EmptyMailboxErr
 */
export declare class EmptyMailboxErr extends Error {
    constructor();
}
/**
 * UnknownAddressErr
 */
export declare class UnknownAddressErr extends Error {
    actor: string;
    constructor(actor: string);
}
/**
 * MissingSymbolErr
 */
export declare class MissingSymbolErr extends Error {
    index: number;
    constructor(index: number);
}
/**
 * IntegerOverflowErr
 */
export declare class IntegerOverflowErr extends Error {
    constructor();
}
/**
 * StackEmptyErr
 */
export declare class StackEmptyErr extends Error {
    constructor();
}
/**
 * InvalidPropertyIndex
 */
export declare class InvalidPropertyIndex extends Error {
    cons: TypeInfo;
    idx: number;
    constructor(cons: TypeInfo, idx: number);
}
/**
 * MissingInfoErr
 */
export declare class MissingInfoErr extends Error {
    idx: number;
    constructor(idx: number);
}
/**
 * InvalidConstructorErr
 */
export declare class InvalidConstructorErr extends Error {
    name: string;
    constructor(name: string);
}
/**
 * InvalidFunctionErr
 */
export declare class InvalidFunctionErr extends Error {
    name: string;
    constructor(name: string);
}
/**
 * UnknownInstanceErr
 */
export declare class UnknownInstanceErr extends Error {
    instance: object;
    constructor(instance: object);
}
/**
 * UnknownFuncErr
 */
export declare class UnknownFunErr extends Error {
    name: string;
    constructor(name: string);
}
