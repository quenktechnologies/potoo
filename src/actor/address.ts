import { tail } from '@quenk/noni/lib/data/array';
import { startsWith } from '@quenk/noni/lib/data/string';

export const SEPERATOR = '/';

export const ADDRESS_DISCARD = '?';
export const ADDRESS_SYSTEM = '$';
export const ADDRESS_EMPTY = '';
export const ADDRESS_RESTRICTED = [
    ADDRESS_DISCARD,
    ADDRESS_SYSTEM,
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
    ((parent === SEPERATOR) || (parent === ADDRESS_EMPTY)) ?
        `${parent}${id}` :
        (parent === ADDRESS_SYSTEM) ?
            id :
            `${parent}${SEPERATOR}${id}`;

/**
 * getParent computes the parent of an Address.
 */
export const getParent = (addr: Address): Address => {

    if (((addr === ADDRESS_SYSTEM) ||
        (addr === ADDRESS_EMPTY) ||
        (addr === ADDRESS_DISCARD) || (addr === SEPERATOR))) {

        return ADDRESS_SYSTEM;

    } else {

        let b4 = addr.split(SEPERATOR);

        if ((b4.length === 2) && (b4[0] === '')) {

            return SEPERATOR;

        } else {

            let a = b4
                .reverse()
                .slice(1)
                .reverse()
                .join(SEPERATOR);

            return a === ADDRESS_EMPTY ? ADDRESS_SYSTEM : a;


        }

    }

}

/**
 * getId provides the id part of an actor address.
 */
export const getId = (addr: Address): string =>
    ((addr === ADDRESS_SYSTEM) ||
        (addr === ADDRESS_DISCARD) ||
        (addr === ADDRESS_EMPTY) ||
        (addr === SEPERATOR)) ?
        addr :
        tail(addr.split(SEPERATOR));

/**
 * isChild tests whether an address is a child of the parent address.
 */
export const isChild = (parent: Address, child: Address): boolean =>
 (parent === ADDRESS_SYSTEM) || (parent !== child) && startsWith(child, parent);

/**
 * isGroup determines if an address is a group reference.
 */
export const isGroup = (addr:Address) : boolean => 
  ((addr[0] === '$') && (addr !== '$'))
