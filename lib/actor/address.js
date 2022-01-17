"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroup = exports.isChild = exports.getId = exports.getParent = exports.make = exports.isRestricted = exports.ADDRESS_RESTRICTED = exports.ADDRESS_EMPTY = exports.ADDRESS_SYSTEM = exports.ADDRESS_DISCARD = exports.SEPERATOR = void 0;
const array_1 = require("@quenk/noni/lib/data/array");
const string_1 = require("@quenk/noni/lib/data/string");
exports.SEPERATOR = '/';
exports.ADDRESS_DISCARD = '?';
exports.ADDRESS_SYSTEM = '$';
exports.ADDRESS_EMPTY = '';
exports.ADDRESS_RESTRICTED = [
    exports.ADDRESS_DISCARD,
    exports.ADDRESS_SYSTEM,
    exports.SEPERATOR
];
/**
 * isRestricted indicates whether an actor id is restricted or not.
 */
const isRestricted = (id) => ((exports.ADDRESS_RESTRICTED.some(a => id.indexOf(a) > -1)) && (id !== exports.SEPERATOR));
exports.isRestricted = isRestricted;
/**
 * make a child address given its id and parent address.
 */
const make = (parent, id) => ((parent === exports.SEPERATOR) || (parent === exports.ADDRESS_EMPTY)) ?
    `${parent}${id}` :
    (parent === exports.ADDRESS_SYSTEM) ?
        id :
        `${parent}${exports.SEPERATOR}${id}`;
exports.make = make;
/**
 * getParent computes the parent of an Address.
 */
const getParent = (addr) => {
    if (((addr === exports.ADDRESS_SYSTEM) ||
        (addr === exports.ADDRESS_EMPTY) ||
        (addr === exports.ADDRESS_DISCARD) || (addr === exports.SEPERATOR))) {
        return exports.ADDRESS_SYSTEM;
    }
    else {
        let b4 = addr.split(exports.SEPERATOR);
        if ((b4.length === 2) && (b4[0] === '')) {
            return exports.SEPERATOR;
        }
        else {
            let a = b4
                .reverse()
                .slice(1)
                .reverse()
                .join(exports.SEPERATOR);
            return a === exports.ADDRESS_EMPTY ? exports.ADDRESS_SYSTEM : a;
        }
    }
};
exports.getParent = getParent;
/**
 * getId provides the id part of an actor address.
 */
const getId = (addr) => ((addr === exports.ADDRESS_SYSTEM) ||
    (addr === exports.ADDRESS_DISCARD) ||
    (addr === exports.ADDRESS_EMPTY) ||
    (addr === exports.SEPERATOR)) ?
    addr :
    (0, array_1.tail)(addr.split(exports.SEPERATOR));
exports.getId = getId;
/**
 * isChild tests whether an address is a child of the parent address.
 */
const isChild = (parent, child) => (parent === exports.ADDRESS_SYSTEM) || (parent !== child) && (0, string_1.startsWith)(child, parent);
exports.isChild = isChild;
/**
 * isGroup determines if an address is a group reference.
 */
const isGroup = (addr) => ((addr[0] === '$') && (addr !== '$'));
exports.isGroup = isGroup;
//# sourceMappingURL=address.js.map