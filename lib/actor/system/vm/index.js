"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var array_1 = require("@quenk/noni/lib/data/array");
var context_1 = require("./runtime/context");
var state_1 = require("./state");
var record_1 = require("@quenk/noni/lib/data/record");
/**
 * PVM is the Potoo Virtual Machine.
 */
var PVM = /** @class */ (function () {
    function PVM(system) {
        this.system = system;
        /**
         * state contains information about all the actors in the system, routers
         * and groups.
         */
        this.state = {
            contexts: {},
            runtimes: {},
            routers: {},
            groups: {}
        };
        /**
         * queue of scripts to be executed by the system in order.
         */
        this.queue = [];
        this.running = false;
    }
    PVM.prototype.raise = function (_) {
        //TODO: implement
    };
    PVM.prototype.allocate = function (addr, t) {
        var args = Array.isArray(t.args) ? t.args : [];
        var act = t.create.apply(t, __spreadArrays([this.system], args));
        //TODO: review instance init.
        return context_1.newContext(act, addr, t);
    };
    PVM.prototype.getContext = function (addr) {
        return state_1.get(this.state, addr);
    };
    PVM.prototype.getRouter = function (addr) {
        return state_1.getRouter(this.state, addr);
    };
    PVM.prototype.putContext = function (addr, ctx) {
        this.state = state_1.put(this.state, addr, ctx);
        return this;
    };
    PVM.prototype.putMember = function (group, addr) {
        state_1.putMember(this.state, group, addr);
        return this;
    };
    PVM.prototype.putRoute = function (target, router) {
        state_1.putRoute(this.state, target, router);
        return this;
    };
    PVM.prototype.removeRoute = function (target) {
        state_1.removeRoute(this.state, target);
        return this;
    };
    PVM.prototype.exec = function (i, s) {
        var ret = maybe_1.nothing();
        var mslot = getSlot(this.state, i);
        //TODO: EVENT_INVALID_EXEC
        if (mslot.isNothing())
            return maybe_1.nothing();
        var _a = mslot.get(), addr = _a[0], rtime = _a[1];
        this.queue.push([addr, s, rtime]);
        if (this.running === true)
            maybe_1.nothing();
        this.running = true;
        while ((!array_1.empty(this.queue)) && this.running) {
            var next = this.queue.shift();
            var _b = next, script = _b[1], runtime = _b[2];
            runtime.invokeMain(script);
            ret = runtime.run();
        }
        this.running = false;
        return ret;
    };
    return PVM;
}());
exports.PVM = PVM;
var getSlot = function (s, actor) {
    return record_1.reduce(s.runtimes, maybe_1.nothing(), function (p, c, k) {
        return c.context.actor === actor ? maybe_1.fromNullable([k, c]) : p;
    });
};
//# sourceMappingURL=index.js.map