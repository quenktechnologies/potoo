"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var template = require("../../template");
var errors = require("./runtime/error");
var events = require("./event");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var either_1 = require("@quenk/noni/lib/data/either");
var array_1 = require("@quenk/noni/lib/data/array");
var record_1 = require("@quenk/noni/lib/data/record");
var address_1 = require("../../address");
var template_1 = require("../../template");
var flags_1 = require("../../flags");
var state_1 = require("./state");
var context_1 = require("./runtime/context");
var thread_1 = require("./runtime/thread");
var heap_1 = require("./runtime/heap");
var conf_1 = require("./conf");
/**
 * PVM is the Potoo Virtual Machine.
 */
var PVM = /** @class */ (function () {
    function PVM(system, conf) {
        if (conf === void 0) { conf = conf_1.defaults(); }
        this.system = system;
        this.conf = conf;
        /**
         * state contains information about all the actors in the system, routers
         * and groups.
         */
        this.state = {
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
    PVM.prototype.allocate = function (parent, t) {
        var _this = this;
        var temp = template_1.normalize(t);
        if (address_1.isRestricted(temp.id))
            return either_1.left(new errors.InvalidIdErr(temp.id));
        var addr = address_1.make(parent, temp.id);
        if (this.getRuntime(addr).isJust())
            return either_1.left(new errors.DuplicateAddressErr(addr));
        var args = Array.isArray(t.args) ? t.args : [];
        var act = t.create.apply(t, __spreadArrays([this.system], args));
        var thr = new thread_1.Thread(this, new heap_1.Heap(), act.init(context_1.newContext(act, addr, t)));
        this.putRuntime(addr, thr);
        if (flags_1.isRouter(thr.context.flags))
            this.putRoute(addr, addr);
        if (temp.group) {
            var groups = (typeof temp.group === 'string') ?
                [temp.group] : temp.group;
            groups.forEach(function (g) { return _this.putMember(g, addr); });
        }
        return either_1.right(addr);
    };
    PVM.prototype.runActor = function (target) {
        //TODO: async support
        var mrtime = this.getRuntime(target);
        if (mrtime.isNothing())
            return either_1.left(new errors.UnknownAddressErr(target));
        var rtime = mrtime.get();
        rtime.context.actor.start();
        return either_1.right(undefined);
    };
    PVM.prototype.sendMessage = function (to, from, msg) {
        var mRouter = this.getRouter(to);
        var mctx = mRouter.isJust() ?
            mRouter :
            this.getRuntime(to).map(function (r) { return r.context; });
        if (mctx.isJust()) {
            var ctx = mctx.get();
            if (flags_1.isBuffered(ctx.flags)) {
                ctx.mailbox.push(msg);
                ctx.actor.notify();
            }
            else {
                ctx.actor.accept(msg);
            }
            this.trigger(events.EVENT_SEND_OK, from, to, msg);
            return true;
        }
        else {
            this.trigger(events.EVENT_SEND_FAILED, from, to, msg);
            return false;
        }
    };
    PVM.prototype.getRuntime = function (addr) {
        return state_1.get(this.state, addr);
    };
    PVM.prototype.getRouter = function (addr) {
        return state_1.getRouter(this.state, addr).map(function (r) { return r.context; });
    };
    PVM.prototype.getGroup = function (name) {
        return state_1.getGroup(this.state, name.split('$').join(''));
    };
    PVM.prototype.getChildren = function (addr) {
        return maybe_1.fromNullable(state_1.getChildren(this.state, addr));
    };
    PVM.prototype.putRuntime = function (addr, r) {
        this.state = state_1.put(this.state, addr, r);
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
    PVM.prototype.remove = function (addr) {
        var _this = this;
        this.state = state_1.remove(this.state, addr);
        record_1.map(this.state.routers, function (r, k) {
            if (r === addr)
                delete _this.state.routers[k];
        });
        return this;
    };
    PVM.prototype.removeRoute = function (target) {
        state_1.removeRoute(this.state, target);
        return this;
    };
    PVM.prototype.raise = function (addr, err) {
        var _this = this;
        //TODO: pause the runtime.
        var next = addr;
        loop: while (true) {
            var mrtime = this.getRuntime(next);
            if (next === address_1.ADDRESS_SYSTEM) {
                if (err instanceof Error)
                    throw err;
                throw new Error(err.message);
            }
            //TODO: This risks swallowing errors.
            if (mrtime.isNothing())
                return;
            var rtime = mrtime.get();
            var trap = rtime.context.template.trap ||
                (function () { return template.ACTION_RAISE; });
            //TODO: async support
            switch (trap(err)) {
                case template.ACTION_IGNORE:
                    break loop;
                case template.ACTION_RESTART:
                    this.kill(next);
                    var eRes = this
                        .allocate(address_1.getParent(next), rtime.context.template)
                        .chain(function (a) { return _this.runActor(a); });
                    if (eRes.isLeft())
                        throw new Error(eRes.takeLeft().message);
                    break loop;
                case template.ACTION_STOP:
                    this.kill(next);
                    break loop;
                default:
                    //escalate
                    next = address_1.getParent(next);
                    break;
            }
        }
    };
    PVM.prototype.trigger = function (addr, evt) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (this.conf.log)
            this.conf.log(evt, addr, args);
    };
    PVM.prototype.kill = function (addr) {
        var _this = this;
        var addrs = address_1.isGroup(addr) ?
            this.getGroup(addr).orJust(function () { return []; }).get() : [addr];
        addrs.every(function (a) {
            //TODO: async support
            var mrun = _this.getRuntime(a);
            if (mrun.isJust())
                mrun.get().terminate();
        });
    };
    PVM.prototype.exec = function (i, s) {
        var ret = maybe_1.nothing();
        var mslot = getSlot(this.state, i);
        if (mslot.isNothing()) {
            this.trigger(events.EVENT_INVALID_EXEC, '$', i);
            return maybe_1.nothing();
        }
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