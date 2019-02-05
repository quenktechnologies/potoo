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
 * isRestricted indicates whether an actor id is restricted or not.
 */
export declare const isRestricted: (id: string) => boolean;
/**
 * make a child address given its id and parent address.
 */
export declare const make: (parent: string, id: string) => string;
/**
 * getParent computes the parent of an Address.
 */
export declare const getParent: (addr: string) => string;
/**
 * getId provides the id part of an actor address.
 */
export declare const getId: (addr: string) => string;
/**
 * isChild tests whether an address is a child of the parent address.
 */
export declare const isChild: (parent: string, child: string) => boolean;
