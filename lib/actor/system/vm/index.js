"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var context_1 = require("../../context");
var state_1 = require("../state");
/**
 * PVM is the Potoo Virtual Machine.
 */
var PVM = /** @class */ (function () {
    function PVM(system, config) {
        this.system = system;
        this.config = config;
        /**
         * state contains information about all the actors in the system, routers
         * and groups.
         */
        this.state = {
            contexts: {},
            routers: {},
            groups: {}
        };
        /**
         * pending scripts to execute.
         */
        this.pending = [];
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
    PVM.prototype.exec = function (_i, _s) {
    };
    return PVM;
}());
exports.PVM = PVM;
//# sourceMappingURL=index.js.map