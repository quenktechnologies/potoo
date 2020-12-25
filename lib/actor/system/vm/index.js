"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PVM = exports.MAX_WORK_LOAD = void 0;
var template = require("../../template");
var scripts = require("../../resident/scripts");
var errors = require("./runtime/error");
var events = require("./event");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var either_1 = require("@quenk/noni/lib/data/either");
var array_1 = require("@quenk/noni/lib/data/array");
var record_1 = require("@quenk/noni/lib/data/record");
var array_2 = require("@quenk/noni/lib/data/array");
var type_1 = require("@quenk/noni/lib/data/type");
var resident_1 = require("../../resident");
var address_1 = require("../../address");
var template_1 = require("../../template");
var flags_1 = require("../../flags");
var message_1 = require("../../message");
var state_1 = require("./state");
var context_1 = require("./runtime/context");
var thread_1 = require("./runtime/thread");
var heap_1 = require("./runtime/heap");
var conf_1 = require("./conf");
var op_1 = require("./runtime/op");
var log_1 = require("./log");
var event_1 = require("./event");
exports.MAX_WORK_LOAD = 25;
/**
 * PVM is the Potoo Virtual Machine.
 */
var PVM = /** @class */ (function () {
    function PVM(system, conf) {
        var _this = this;
        if (conf === void 0) { conf = conf_1.defaults(); }
        this.system = system;
        this.conf = conf;
        /**
         * state contains information about all the actors in the system, routers
         * and groups.
         */
        this.state = {
            runtimes: {
                $: new thread_1.Thread(this, new heap_1.Heap(), (context_1.newContext(this, '$', { create: function () { return _this; } })))
            },
            routers: {},
            groups: {}
        };
        /**
         * runQ is the queue of pending Scripts to be executed.
         */
        this.runQ = [];
        /**
         * waitQ is the queue of pending Scripts for Runtimes that are awaiting
         * the completion of an async task.
         */
        this.waitQ = [];
        /**
         * blocked is a
         */
        this.blocked = [];
        this.running = false;
    }
    PVM.create = function (s, conf) {
        return new PVM(s, record_1.rmerge(conf_1.defaults(), conf));
    };
    PVM.prototype.init = function (c) {
        return c;
    };
    PVM.prototype.accept = function (_) {
    };
    PVM.prototype.start = function () {
    };
    PVM.prototype.notify = function () {
    };
    PVM.prototype.stop = function () {
        return this.kill(address_1.ADDRESS_SYSTEM, address_1.ADDRESS_SYSTEM);
    };
    PVM.prototype.allocate = function (parent, t) {
        var _this = this;
        var temp = template_1.normalize(t);
        if (address_1.isRestricted(temp.id))
            return either_1.left(new errors.InvalidIdErr(temp.id));
        var addr = address_1.make(parent, temp.id);
        if (this.getRuntime(addr).isJust())
            return either_1.left(new errors.DuplicateAddressErr(addr));
        var args = Array.isArray(t.args) ? t.args : [];
        var act = t.create.apply(t, __spreadArrays([this.system, t], args));
        var thr = new thread_1.Thread(this, new heap_1.Heap(), act.init(context_1.newContext(act, addr, t)));
        this.putRuntime(addr, thr);
        this.trigger(addr, events.EVENT_ACTOR_CREATED);
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
        var mrtime = this.getRuntime(target);
        if (mrtime.isNothing())
            return future_1.raise(new errors.UnknownAddressErr(target));
        var rtime = mrtime.get();
        var ft = rtime.context.actor.start(target);
        this.trigger(rtime.context.address, events.EVENT_ACTOR_STARTED);
        return ((ft != null) ? ft : future_1.pure(undefined));
    };
    PVM.prototype.runTask = function (addr, ft) {
        var _this = this;
        this.blocked = array_1.dedupe(this.blocked.concat(addr));
        //XXX: Fork is used here instead of finally because the raise() method
        // may trigger side-effects. For example the actor being stopped or 
        // restarted.
        ft
            .fork(function (e) {
            _this.blocked = array_2.remove(_this.blocked, addr);
            _this.raise(addr, e);
        }, function () {
            _this.blocked = array_2.remove(_this.blocked, addr);
            //TODO: This is done to keep any waiting scripts going after
            //the task completes. The side-effect of this needs to be
            //observed a bit more but scripts of blocked actors other
            //than addr should not be affected. In future it may suffice
            //to run only scripts for addr.
            _this.run();
        });
    };
    PVM.prototype.sendMessage = function (to, from, m) {
        var mRouter = this.getRouter(to);
        var mctx = mRouter.isJust() ?
            mRouter :
            this.getRuntime(to).map(function (r) { return r.context; });
        //TODO: We dont want to pass HeapObjects to actors?
        //Its annoying for ES actors but may be necessary for vm actors.
        //There are various things that could be done here. If we make all 
        //PTValues an interface then we could just promote. Alternatively we
        //could introduce a Foreign PTValue to represent foreign values.
        //Much more thought is needed but for now we don't want HeapObjects
        //passed to ES actors.
        var msg = type_1.isObject(m) ? m.promote() : m;
        //routers receive enveloped messages.
        var actualMessage = mRouter.isJust() ?
            new message_1.Envelope(to, from, msg) : msg;
        if (mctx.isJust()) {
            var ctx = mctx.get();
            if (flags_1.isBuffered(ctx.flags)) {
                ctx.mailbox.push(actualMessage);
                ctx.actor.notify();
            }
            else {
                ctx.actor.accept(actualMessage);
            }
            this.trigger(from, events.EVENT_SEND_OK, to, msg);
            return true;
        }
        else {
            this.trigger(from, events.EVENT_SEND_FAILED, to, msg);
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
        var _loop_1 = function () {
            var mrtime = this_1.getRuntime(next);
            if (next === address_1.ADDRESS_SYSTEM) {
                if (err instanceof Error)
                    throw err;
                throw new Error(err.message);
            }
            //TODO: This risks swallowing errors.
            if (mrtime.isNothing())
                return { value: void 0 };
            var rtime = mrtime.get();
            var trap = rtime.context.template.trap ||
                (function () { return template.ACTION_RAISE; });
            switch (trap(err)) {
                case template.ACTION_IGNORE: return "break-loop";
                case template.ACTION_RESTART:
                    this_1.runTask(next, this_1.kill(next, next)
                        .chain(function () {
                        var eRes = _this.allocate(address_1.getParent(next), rtime.context.template);
                        return eRes.isLeft() ?
                            future_1.raise(new Error(eRes.takeLeft().message)) :
                            _this.runActor(eRes.takeRight());
                    }));
                    return "break-loop";
                case template.ACTION_STOP:
                    this_1.runTask(next, this_1.kill(next, next));
                    return "break-loop";
                default:
                    //escalate
                    next = address_1.getParent(next);
                    break;
            }
        };
        var this_1 = this;
        loop: while (true) {
            var state_2 = _loop_1();
            if (typeof state_2 === "object")
                return state_2.value;
            switch (state_2) {
                case "break-loop": break loop;
            }
        }
    };
    PVM.prototype.trigger = function (addr, evt) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var elvl = event_1.getLevel(evt);
        var _a = this.conf.log, level = _a.level, logger = _a.logger;
        if (level >= elvl) {
            switch (elvl) {
                case log_1.LOG_LEVEL_DEBUG:
                    logger.debug(addr, evt, args);
                    break;
                case log_1.LOG_LEVEL_INFO:
                    logger.info(addr, evt, args);
                    break;
                case log_1.LOG_LEVEL_NOTICE:
                case log_1.LOG_LEVEL_WARN:
                    logger.warn(addr, evt, args);
                    break;
                case log_1.LOG_LEVEL_ERROR:
                    logger.error(addr, evt, args);
                    break;
                default:
                    break;
            }
        }
        //forward the event to relevant hooks.
        if (this.conf.on[evt] != null)
            this.conf.on[evt].apply(null, __spreadArrays([addr, evt], args));
    };
    PVM.prototype.logOp = function (r, f, op, oper) {
        if (this.conf.log.level >= log_1.LOG_LEVEL_DEBUG)
            this.conf.log.logger.debug.apply(null, __spreadArrays([
                "[" + r.context.address + "]",
                "(" + f.script.name + ")"
            ], op_1.toLog(op, r, f, oper)));
    };
    PVM.prototype.kill = function (parent, target) {
        var _this = this;
        var addrs = address_1.isGroup(target) ?
            this.getGroup(target).orJust(function () { return []; }).get() : [target];
        return scheduleFutures(addrs.map(function (addr) {
            if ((!address_1.isChild(parent, target)) && (target !== parent))
                return future_1.raise(new Error("IllegalStopErr: Actor " + parent + " " +
                    ("cannot kill non-child " + addr + "!")));
            var mrun = _this.getRuntime(addr);
            if (mrun.isNothing())
                return future_1.pure(undefined);
            var run = mrun.get();
            var mchilds = _this.getChildren(target);
            var childs = mchilds.isJust() ? mchilds.get() : {};
            var cwork = record_1.mapTo(record_1.map(childs, function (r, k) {
                return r
                    .die()
                    .chain(function () {
                    _this.remove(k);
                    return future_1.pure(undefined);
                });
            }), function (f) { return f; });
            return scheduleFutures(cwork)
                .chain(function () {
                return addr === address_1.ADDRESS_SYSTEM ?
                    future_1.pure(undefined) :
                    run.die();
            })
                .chain(function () {
                _this.trigger(run.context.address, events.EVENT_ACTOR_STOPPED);
                if (addr !== address_1.ADDRESS_SYSTEM)
                    _this.remove(addr);
                return future_1.pure(undefined);
            });
        }));
    };
    /**
     * spawn an actor.
     *
     * This actor will be a direct child of the root.
     */
    PVM.prototype.spawn = function (t) {
        return resident_1.spawn(this.system, this, t);
    };
    /**
     * tell allows the vm to send a message to another actor via opcodes.
     *
     * If you want to immediately deliver a message, use [[sendMessage]] instead.
     */
    PVM.prototype.tell = function (ref, m) {
        this.system.exec(this, new scripts.Tell(ref, m));
        return this;
    };
    PVM.prototype.execNow = function (i, s) {
        var mslot = getSlot(this.state, i);
        if (mslot.isNothing()) {
            this.trigger(address_1.ADDRESS_SYSTEM, events.EVENT_EXEC_INSTANCE_STALE);
            return maybe_1.nothing();
        }
        else {
            var _a = mslot.get(), rtime = _a[1];
            return new thread_1.Thread(this, rtime.heap, rtime.context).exec(s);
        }
    };
    PVM.prototype.exec = function (i, s) {
        var mslot = getSlot(this.state, i);
        if (mslot.isNothing()) {
            this.trigger(address_1.ADDRESS_SYSTEM, events.EVENT_EXEC_INSTANCE_STALE);
        }
        else {
            var _a = mslot.get(), addr = _a[0], rtime = _a[1];
            this.runQ.push([addr, s, rtime]);
            this.run();
        }
    };
    PVM.prototype.run = function () {
        var _this = this;
        if (this.running === true)
            return;
        this.running = true;
        doRun: while (this.running) {
            while (!array_1.empty(this.runQ)) {
                var next = this.runQ.shift();
                var addr = next[0], script = next[1], rtime = next[2];
                var mctime = this.getRuntime(addr);
                //is the runtime still here?
                if (mctime.isNothing()) {
                    this.trigger(addr, events.EVENT_EXEC_ACTOR_GONE);
                    //is it the same instance?
                }
                else if (mctime.get() !== rtime) {
                    this.trigger(addr, events.EVENT_EXEC_ACTOR_CHANGED);
                    // is the runtime awaiting an async task?
                }
                else if (array_1.contains(this.blocked, addr)) {
                    this.waitQ.push(next);
                }
                else {
                    rtime.exec(script);
                }
            }
            var _a = array_1.partition(this.waitQ, function (s) {
                return !array_1.contains(_this.blocked, s[0]);
            }), unblocked = _a[0], blocked = _a[1];
            this.waitQ = blocked;
            if (unblocked.length > 0) {
                this.runQ = this.runQ.concat(unblocked);
                continue doRun;
            }
            this.running = false;
        }
    };
    return PVM;
}());
exports.PVM = PVM;
var getSlot = function (s, actor) {
    return record_1.reduce(s.runtimes, maybe_1.nothing(), function (p, c, k) {
        return c.context.actor === actor ? maybe_1.fromNullable([k, c]) : p;
    });
};
var scheduleFutures = function (work) {
    return future_1.batch(array_1.distribute(work, exports.MAX_WORK_LOAD))
        .chain(function () { return future_1.pure(undefined); });
};
//# sourceMappingURL=index.js.map