import { Address } from '../../../address';
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
export declare class TypeErr extends Error {
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
 * NoReceiveErr
 */
export declare class NoReceiveErr extends Error {
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
    actor: string;
    constructor(actor: string);
}