"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var record_1 = require("@quenk/noni/lib/data/record");
var string_1 = require("@quenk/noni/lib/data/string");
var address_1 = require("../address");
/**
 * exists tests whether an address exists in the State.
 */
exports.exists = function (s, addr) { return record_1.contains(s.contexts, addr); };
/**
 * get a Context using an Address.
 */
exports.get = function (s, addr) { return maybe_1.fromNullable(s.contexts[addr]); };
/**
 * put a new Context in the State.
 */
exports.put = function (s, addr, context) {
    s.contexts[addr] = context;
    return s;
};
/**
 * remove an actor entry.
 */
exports.remove = function (s, addr) {
    delete s.contexts[addr];
    return s;
};
/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
exports.getAddress = function (s, actor) {
    return record_1.reduce(s.contexts, maybe_1.nothing(), function (p, c, k) {
        return c.actor === actor ? maybe_1.fromString(k) : p;
    });
};
/**
 * getChildren returns the child contexts for an address.
 */
exports.getChildren = function (s, addr) {
    return (addr === address_1.ADDRESS_SYSTEM) ?
        s.contexts :
        record_1.partition(s.contexts, function (_, key) {
            return (string_1.startsWith(key, addr) && key !== addr);
        })[0];
};
/**
 * getParent context using an Address.
 */
exports.getParent = function (s, addr) {
    return maybe_1.fromNullable(s.contexts[address_1.getParent(addr)]);
};
/**
 * getRouter will attempt to provide the
 * router context for an Address.
 *
 * The value returned depends on whether the given
 * address begins with any of the installed router's address.
 */
exports.getRouter = function (s, addr) {
    return record_1.reduce(s.routers, maybe_1.nothing(), function (p, k) {
        return string_1.startsWith(addr, k) ? maybe_1.fromNullable(s.contexts[k]) : p;
    });
};
/**
 * putRoute adds a route to the routing table.
 */
exports.putRoute = function (s, target, router) {
    s.routers[target] = router;
    return s;
};
/**
 * removeRoute from the routing table.
 */
exports.removeRoute = function (s, target) {
    delete s.routers[target];
    return s;
};
/**
 * getGroup attempts to provide the addresses of actors that have
 * been assigned to a group.
 *
 * Note that groups must be prefixed with a '$' to be resolved.
 */
exports.getGroup = function (s, name) {
    return s.groups.hasOwnProperty(name) ?
        maybe_1.fromArray(s.groups[name]) : maybe_1.nothing();
};
/**
 * putMember adds an address to a group.
 *
 * If the group does not exist, it will be created.
 */
exports.putMember = function (s, group, member) {
    if (s.groups[group] == null)
        s.groups[group] = [];
    s.groups[group].push(member);
    return s;
};
/**
 * removeMember from a group.
 */
exports.removeMember = function (s, group, member) {
    if (s.groups[group] != null)
        s.groups[group] = s.groups[group].filter(function (m) { return m != member; });
    return s;
};
//# sourceMappingURL=state.js.map