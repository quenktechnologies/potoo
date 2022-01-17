"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyMessageBuffer = exports.createMessageBuffer = exports.removeMember = exports.putMember = exports.getGroup = exports.removeGroup = exports.removeRoute = exports.putRoute = exports.getRouter = exports.getParent = exports.getChildren = exports.getAddress = exports.remove = exports.put = exports.get = exports.exists = void 0;
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const record_1 = require("@quenk/noni/lib/data/record");
const string_1 = require("@quenk/noni/lib/data/string");
const address_1 = require("../../address");
/**
 * exists tests whether an address exists in the State.
 */
const exists = (s, addr) => (0, record_1.hasKey)(s.threads, addr);
exports.exists = exists;
/**
 * get a Thread from the State using an address.
 */
const get = (s, addr) => (0, maybe_1.fromNullable)(s.threads[addr]);
exports.get = get;
/**
 * put a new Thread in the State.
 */
const put = (s, addr, r) => {
    s.threads[addr] = r;
    return s;
};
exports.put = put;
/**
 * remove an actor entry.
 */
const remove = (s, addr) => {
    delete s.threads[addr];
    return s;
};
exports.remove = remove;
/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
const getAddress = (s, actor) => (0, record_1.reduce)(s.threads, (0, maybe_1.nothing)(), (p, c, k) => c.context.actor === actor ? (0, maybe_1.fromString)(k) : p);
exports.getAddress = getAddress;
/**
 * getChildren returns the child contexts for an address.
 */
const getChildren = (s, addr) => (addr === address_1.ADDRESS_SYSTEM) ?
    (0, record_1.exclude)(s.threads, address_1.ADDRESS_SYSTEM) :
    (0, record_1.partition)(s.threads, (_, key) => ((0, string_1.startsWith)(key, addr) && key !== addr))[0];
exports.getChildren = getChildren;
/**
 * getParent context using an Address.
 */
const getParent = (s, addr) => (0, maybe_1.fromNullable)(s.threads[(0, address_1.getParent)(addr)]);
exports.getParent = getParent;
/**
 * getRouter will attempt to provide the
 * router context for an Address.
 *
 * The value returned depends on whether the given
 * address begins with any of the installed router's address.
 */
const getRouter = (s, addr) => (0, record_1.reduce)(s.routers, (0, maybe_1.nothing)(), (p, k) => (0, string_1.startsWith)(addr, k) ? (0, maybe_1.fromNullable)(s.threads[k]) : p);
exports.getRouter = getRouter;
/**
 * putRoute adds a route to the routing table.
 */
const putRoute = (s, target, router) => {
    s.routers[target] = router;
    return s;
};
exports.putRoute = putRoute;
/**
 * removeRoute from the routing table.
 */
const removeRoute = (s, target) => {
    delete s.routers[target];
    return s;
};
exports.removeRoute = removeRoute;
/**
 * removeGroup from the groups table.
 */
const removeGroup = (s, target) => {
    delete s.groups[target];
    return s;
};
exports.removeGroup = removeGroup;
/**
 * getGroup attempts to provide the addresses of actors that have
 * been assigned to a group.
 *
 * Note that groups must be prefixed with a '$' to be resolved.
 */
const getGroup = (s, name) => s.groups.hasOwnProperty(name) ?
    (0, maybe_1.fromArray)(s.groups[name]) : (0, maybe_1.nothing)();
exports.getGroup = getGroup;
/**
 * putMember adds an address to a group.
 *
 * If the group does not exist, it will be created.
 */
const putMember = (s, group, member) => {
    if (s.groups[group] == null)
        s.groups[group] = [];
    s.groups[group].push(member);
    return s;
};
exports.putMember = putMember;
/**
 * removeMember from a group.
 */
const removeMember = (s, group, member) => {
    if (s.groups[group] != null)
        s.groups[group] = s.groups[group].filter(m => m != member);
    return s;
};
exports.removeMember = removeMember;
/**
 * createMessageBuffer creates a temporary message buffer for the actor address.
 */
const createMessageBuffer = (s, addr) => {
    s.pendingMessages[addr] = [];
    return s;
};
exports.createMessageBuffer = createMessageBuffer;
/**
 * destroyMessageBuffer removes the message buffer (if any) for the provided
 * address.
 */
const destroyMessageBuffer = (s, addr) => {
    delete s.pendingMessages[addr];
    return s;
};
exports.destroyMessageBuffer = destroyMessageBuffer;
//# sourceMappingURL=state.js.map