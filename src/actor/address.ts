
export const SEPERATOR = '/';

export const ADDRESS_DISCARD = '?';
export const ADDRESS_SYSTEM = '$';
export const ADDRESS_EMPTY = '';

export const ADDRESS_RESTRICTED = [
    ADDRESS_DISCARD,
    ADDRESS_SYSTEM,
    ADDRESS_EMPTY,
    SEPERATOR
];

/**
 * Address of an actor.
 *
 * Addresses are used to properly route messages between actors in the system
 * and conform to the path part of a URL.
 */
export type Address = string;

/**
 * isRestricted indicates whether an actor id is restricted or not.
 */
export const isRestricted = (id: string) =>
    ((ADDRESS_RESTRICTED.some(a => id.indexOf(a) > -1)) && (id !== SEPERATOR));

/**
 * make a child address given its id and parent address.
 */
export const make = (parent: Address, id: string): Address =>
    ((parent === SEPERATOR) || (parent === '')) ?
        `${parent}${id}` :
        `${parent}${SEPERATOR}${id}`;

/**
 * getParent computes the parent of an Address.
 */
export const getParent = (addr: Address): Address =>
    ((addr === ADDRESS_SYSTEM) || (addr === ADDRESS_DISCARD) || (addr === SEPERATOR)) ?
        ADDRESS_SYSTEM :
        addr.split(SEPERATOR).reverse().slice(1).reverse().join(SEPERATOR);
