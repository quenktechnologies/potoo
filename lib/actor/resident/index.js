"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ref = exports.AbstractResident = void 0;
var record_1 = require("@quenk/noni/lib/data/record");
var type_1 = require("@quenk/noni/lib/data/type");
/**
 * AbstractResident is a base implementation of a Resident actor.
 */
var AbstractResident = /** @class */ (function () {
    function AbstractResident(system) {
        this.system = system;
        this.self = getSelf(this);
    }
    Object.defineProperty(AbstractResident.prototype, "platform", {
        get: function () {
            return this.system.getPlatform();
        },
        enumerable: false,
        configurable: true
    });
    AbstractResident.prototype.notify = function () {
        this.platform.exec(this, 'notify');
    };
    AbstractResident.prototype.accept = function (_) { };
    AbstractResident.prototype.spawn = function (t) {
        return this.system.getPlatform().spawn(this, t);
    };
    AbstractResident.prototype.spawnGroup = function (group, tmpls) {
        var _this = this;
        return record_1.map(tmpls, function (t) { return _this.spawn(type_1.isObject(t) ?
            record_1.merge(t, { group: group }) : { group: group, create: t }); });
    };
    AbstractResident.prototype.tell = function (ref, msg) {
        var heap = this.platform.heap;
        this.exec('tell', [heap.string(ref), heap.object(msg)]);
        return this;
    };
    AbstractResident.prototype.raise = function (e) {
        this.system.getPlatform().raise(this, e);
        return this;
    };
    AbstractResident.prototype.kill = function (addr) {
        var _this = this;
        this.platform.kill(this, addr).fork(function (e) { return _this.raise(e); });
        return this;
    };
    AbstractResident.prototype.exit = function () {
        this.kill(this.self());
    };
    AbstractResident.prototype.start = function (addr) {
        this.self = function () { return addr; };
        return this.run();
    };
    AbstractResident.prototype.run = function () { };
    AbstractResident.prototype.stop = function () { };
    /**
     * exec calls a VM function by name on behalf of this actor.
     */
    AbstractResident.prototype.exec = function (fname, args) {
        this.platform.exec(this, fname, args);
    };
    return AbstractResident;
}());
exports.AbstractResident = AbstractResident;
/**
 * ref produces a function for sending messages to an actor address.
 */
exports.ref = function (res, addr) {
    return function (m) {
        return res.tell(addr, m);
    };
};
var getSelf = function (actor) {
    var _self = '?';
    return function () {
        if (_self === '?')
            _self = actor
                .system
                .getPlatform()
                .identify(actor)
                .orJust(function () { return '?'; }).get();
        return _self;
    };
};
//# sourceMappingURL=index.js.map