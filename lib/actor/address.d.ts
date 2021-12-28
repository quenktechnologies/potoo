export declare const SEPERATOR = "/";
export declare const ADDRESS_DISCARD = "?";
export declare const ADDRESS_SYSTEM = "$";
export declare const ADDRESS_EMPTY = "";
export declare const ADDRESS_RESTRICTED: string[];
/**
 * Address of an actor.
 *
 * Addresses are used to properly route messages between actors in the system
 * and conform to the path part of a URL.
 */
export declare type Address = string;
/**
 * AddressMap
 */
export interface AddressMap {
    [key: string]: Address;
}
/**
 * isRestricted indicates whether an actor id is restricted or not.
 */
export declare const isRestricted: (id: string) => boolean;
/**
 * make a child address given its id and parent address.
 */
export declare const make: (parent: Address, id: string) => Address;
/**
 * getParent computes the parent of an Address.
 */
export declare const getParent: (addr: Address) => Address;
/**
 * getId provides the id part of an actor address.
 */
export declare const getId: (addr: Address) => string;
/**
 * isChild tests whether an address is a child of the parent address.
 */
export declare const isChild: (parent: Address, child: Address) => boolean;
/**
 * isGroup determines if an address is a group reference.
 */
export declare const isGroup: (addr: Address) => boolean;
