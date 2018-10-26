"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_1 = require("@quenk/noni/lib/data/array");
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
exports.isRestricted = function (id) {
    return ((exports.ADDRESS_RESTRICTED.some(function (a) { return id.indexOf(a) > -1; })) && (id !== exports.SEPERATOR));
};
/**
 * make a child address given its id and parent address.
 */
exports.make = function (parent, id) {
    return ((parent === exports.SEPERATOR) || (parent === exports.ADDRESS_EMPTY)) ?
        "" + parent + id :
        (parent === exports.ADDRESS_SYSTEM) ?
            id :
            "" + parent + exports.SEPERATOR + id;
};
/**
 * getParent computes the parent of an Address.
 */
exports.getParent = function (addr) {
    if (((addr === exports.ADDRESS_SYSTEM) ||
        (addr === exports.ADDRESS_EMPTY) ||
        (addr === exports.ADDRESS_DISCARD) || (addr === exports.SEPERATOR))) {
        return exports.ADDRESS_SYSTEM;
    }
    else {
        var a = addr
            .split(exports.SEPERATOR)
            .reverse()
            .slice(1)
            .reverse()
            .join(exports.SEPERATOR);
        return a === exports.ADDRESS_EMPTY ? exports.ADDRESS_SYSTEM : a;
    }
};
/**
 * getId provides the id part of an actor address.
 */
exports.getId = function (addr) {
    return ((addr === exports.ADDRESS_SYSTEM) ||
        (addr === exports.ADDRESS_DISCARD) ||
        (addr === exports.ADDRESS_EMPTY) ||
        (addr === exports.SEPERATOR)) ?
        addr :
        array_1.tail(addr.split(exports.SEPERATOR));
};
//# sourceMappingURL=address.js.map