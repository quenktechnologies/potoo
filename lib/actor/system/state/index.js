"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var record_1 = require("@quenk/noni/lib/data/record");
var string_1 = require("@quenk/noni/lib/data/string");
var address_1 = require("../../address");
/**
 * exists tests whether an address exists in the State.
 */
exports.exists = function (s, addr) {
    return record_1.contains(s.contexts, addr);
};
/**
 * get a Context using an Address.
 */
exports.get = function (s, addr) {
    return maybe_1.fromNullable(s.contexts[addr]);
};
/**
 * getAddress attempts to retrieve the address of an Actor instance.
 */
exports.getAddress = function (s, actor) {
    return record_1.reduce(s.contexts, maybe_1.nothing(), function (p, c, k) { return c.actor === actor ?
        maybe_1.fromString(k) : p; });
};
/**
 * getInstance attempts to retrieve an actor given its address.
 */
exports.getInstance = function (s, addr) {
    return record_1.reduce(s.contexts, maybe_1.nothing(), function (p, c, k) { return k === addr ?
        maybe_1.fromNullable(c.actor) : p; });
};
/**
 * getTemplate attempts to retrieve the template for an
 * actor given an address.
 */
exports.getTemplate = function (s, addr) {
    return exports.get(s, addr).map(function (f) { return f.template; });
};
/**
 * getMessage attempts to retrieve the next message
 * from an actors mailbox.
 *
 * If sucessfull, the message will be removed.
 */
exports.getMessage = function (s, addr) {
    return exports.get(s, addr)
        .chain(function (f) { return f.mailbox; })
        .chain(function (m) { return maybe_1.fromArray(m); })
        .map(function (m) { return m.shift(); });
};
/**
 * getBehaviour attempts to retrieve the behaviour for an
 * actor given an address.
 */
exports.getBehaviour = function (s, addr) {
    return exports.get(s, addr)
        .chain(function (f) { return maybe_1.fromArray(f.behaviour); })
        .map(function (b) { return b[0]; });
};
/**
 * getChildren returns the child contexts for an address.
 */
exports.getChildren = function (s, addr) {
    return (addr === address_1.ADDRESS_SYSTEM) ?
        s.contexts :
        record_1.partition(s.contexts)(function (_, key) {
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
 * routing actor for an Address.
 *
 * The value returned depends on whether the given
 * address begins with any of the installed router's address.
 */
exports.getRouter = function (s, addr) {
    return record_1.reduce(s.routes, maybe_1.nothing(), function (p, k) {
        return string_1.startsWith(addr, k) ? maybe_1.just(k) : p;
    });
};
/**
 * put a new Context in the State.
 */
exports.put = function (s, addr, context) {
    s.contexts[addr] = context;
    return s;
};
/**
 * putRoute adds a route to the routing table.
 */
exports.putRoute = function (s, from, to) {
    s.routes[from] = to;
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
 * runInstance attempts to invoke the run code of an actor instance.
 */
exports.runInstance = function (s, addr) {
    exports.getInstance(s, addr).map(function (a) { return a.run(); });
};
//# sourceMappingURL=index.js.map