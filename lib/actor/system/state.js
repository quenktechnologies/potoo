"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var record_1 = require("@quenk/noni/lib/data/record");
var string_1 = require("@quenk/noni/lib/data/string");
var address_1 = require("../address");
/**
 * Frame stores all information about an actor
 * needed by the system.
 */
var Frame = /** @class */ (function () {
    function Frame(mailbox, actor, behaviour, flags, template) {
        this.mailbox = mailbox;
        this.actor = actor;
        this.behaviour = behaviour;
        this.flags = flags;
        this.template = template;
    }
    return Frame;
}());
exports.Frame = Frame;
/**
 * State contains Frame entries for all actors in the system.
 */
var State = /** @class */ (function () {
    function State(frames, routes) {
        this.frames = frames;
        this.routes = routes;
    }
    /**
     * exists tests whether an address exists in the State.
     */
    State.prototype.exists = function (addr) {
        return record_1.contains(this.frames, addr);
    };
    /**
     * get a Frame using an Address.
     */
    State.prototype.get = function (addr) {
        return maybe_1.fromNullable(this.frames[addr]);
    };
    /**
     * getAddress attempts to retrieve the address of an Actor instance.
     */
    State.prototype.getAddress = function (actor) {
        return record_1.reduce(this.frames, maybe_1.nothing(), function (p, c, k) { return c.actor === actor ?
            maybe_1.fromString(k) : p; });
    };
    /**
     * getInstance attempts to retrieve an actor given its address.
     */
    State.prototype.getInstance = function (addr) {
        return record_1.reduce(this.frames, maybe_1.nothing(), function (p, c, k) { return k === addr ?
            maybe_1.fromNullable(c.actor) : p; });
    };
    /**
     * getTemplate attempts to retrieve the template for an
     * actor given an address.
     */
    State.prototype.getTemplate = function (addr) {
        return this.get(addr).map(function (f) { return f.template; });
    };
    /**
     * getMessage attempts to retrieve the next message
     * from an actors mailbox.
     *
     * If sucessfull, the message will be removed.
     */
    State.prototype.getMessage = function (addr) {
        return this
            .get(addr)
            .chain(function (f) { return maybe_1.fromArray(f.mailbox); })
            .map(function (m) { return m.shift(); });
    };
    /**
     * getBehaviour attempts to retrieve the behaviour for an
     * actor given an address.
     */
    State.prototype.getBehaviour = function (addr) {
        return this
            .get(addr)
            .chain(function (f) { return maybe_1.fromArray(f.behaviour); })
            .map(function (b) { return b[0]; });
    };
    /**
     * getChildFrames returns the child frames for an address.
     */
    State.prototype.getChildFrames = function (addr) {
        return record_1.partition(this.frames)(function (_, key) {
            return (string_1.startsWith(address_1.getParent(key), addr) && key !== addr);
        })[0];
    };
    /**
     * getRouter will attempt to provide the
     * routing actor for an Address.
     *
     * The value returned depends on whether the given
     * address begins with any of the installed router's address.
     */
    State.prototype.getRouter = function (addr) {
        return record_1.reduce(this.routes, maybe_1.nothing(), function (p, k) {
            return string_1.startsWith(addr, k) ? maybe_1.just(k) : p;
        });
    };
    /**
     * put a new Frame in the State.
     */
    State.prototype.put = function (addr, frame) {
        this.frames[addr] = frame;
        return this;
    };
    /**
     * putRoute adds a route to the routing table.
     */
    State.prototype.putRoute = function (from, to) {
        this.routes[from] = to;
        return this;
    };
    /**
     * remove an actor entry.
     */
    State.prototype.remove = function (addr) {
        delete this.frames[addr];
        return this;
    };
    /**
     * runInstance attempts to invoke the run code of an actor instance.
     */
    State.prototype.runInstance = function (addr) {
        this.getInstance(addr).map(function (a) { return a.run(); });
    };
    return State;
}());
exports.State = State;
/**
 * newFrame constructs a new Frame with default values.
 */
exports.newFrame = function (actor, template) {
    return new Frame([], actor, [], { immutable: false, busy: false }, template);
};
//# sourceMappingURL=state.js.map