"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var errors = require("./runtime/error");
var events = require("./event");
var future_1 = require("@quenk/noni/lib/control/monad/future");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var type_1 = require("@quenk/noni/lib/data/type");
var either_1 = require("@quenk/noni/lib/data/either");
var array_1 = require("@quenk/noni/lib/data/array");
var record_1 = require("@quenk/noni/lib/data/record");
var address_1 = require("../../address");
var flags_1 = require("../../flags");
var message_1 = require("../../message");
var runner_1 = require("./thread/shared/runner");
var shared_1 = require("./thread/shared");
var state_1 = require("./state");
var context_1 = require("./runtime/context");
var op_1 = require("./runtime/op");
var conf_1 = require("./conf");
var log_1 = require("./log");
var ledger_1 = require("./runtime/heap/ledger");
var factory_1 = require("./scripts/factory");
var event_1 = require("./event");
var ID_RANDOM = "#?POTOORAND?#" + Date.now();
exports.MAX_WORK_LOAD = 25;
/**
 * PVM (Potoo Virtual Machine) is a JavaScript implemented virtual machine that
 * functions as a message delivery system between target actors.
 *
 * Actors known to the VM are considered to be part of a system and may or may
 * not reside on the same process/worker/thread depending on the underlying
 * platform and individual actor implementations.
 */
var PVM = /** @class */ (function () {
    function PVM(system, conf) {
        var _this = this;
        if (conf === void 0) { conf = conf_1.defaults(); }
        this.system = system;
        this.conf = conf;
        this._actorIdCounter = -1;
        /**
         * heap memory shared between actor Threads.
         */
        this.heap = new ledger_1.DefaultHeapLedger();
        /**
         * threadRunner shared between vm threads.
         */
        this.threadRunner = new runner_1.SharedThreadRunner(this);
        /**
         * state contains information about all the actors in the system, routers
         * and groups.
         */
        this.state = {
            threads: {
                $: new shared_1.SharedThread(this, factory_1.ScriptFactory.getScript(this), this.threadRunner, context_1.newContext(this._actorIdCounter++, this, '$', {
                    create: function () { return _this; },
                    trap: function () { return template.ACTION_RAISE; }
                }))
            },
            routers: {},
            groups: {},
            pendingMessages: {}
        };
    }
    /**
     * Create a new PVM instance using the provided System implementation and
     * configuration object.
     */
    PVM.create = function (s, conf) {
        if (conf === void 0) { conf = {}; }
        return new PVM(s, record_1.rmerge(conf_1.defaults(), conf));
    };
    PVM.prototype.init = function (c) {
        return c;
    };
    PVM.prototype.accept = function (m) {
        return this.conf.accept(m);
    };
    PVM.prototype.start = function () { };
    PVM.prototype.notify = function () { };
    PVM.prototype.stop = function () {
        return this.kill(this, address_1.ADDRESS_SYSTEM);
    };
    PVM.prototype.identify = function (inst) {
        return state_1.getAddress(this.state, inst);
    };
    PVM.prototype.spawn = function (parent, tmpl) {
        var mparentAddr = this.identify(parent);
        if (mparentAddr.isNothing()) {
            this.raise(this, new errors.UnknownInstanceErr(parent));
            return '?';
        }
        return this._spawn(mparentAddr.get(), normalize(tmpl));
    };
    PVM.prototype._spawn = function (parent, tmpl) {
        var _this = this;
        var eresult = this.allocate(parent, tmpl);
        if (eresult.isLeft()) {
            this.raise(this.state.threads[parent].context.actor, eresult.takeLeft());
            return '?';
        }
        var result = eresult.takeRight();
        this.runActor(result);
        if (Array.isArray(tmpl.children))
            // TODO: Make this call stack friendly some day.
            tmpl.children.forEach(function (tmp) { return _this._spawn(result, tmp); });
        return result;
    };
    PVM.prototype.allocate = function (parent, tmpl) {
        var _this = this;
        if (tmpl.id === ID_RANDOM) {
            var rtime = state_1.get(this.state, parent).get();
            var prefix = rtime.context.actor.constructor.name.toLowerCase();
            tmpl.id = "actor::" + (this._actorIdCounter + 1) + "~" + prefix;
        }
        if (address_1.isRestricted(tmpl.id))
            return either_1.left(new errors.InvalidIdErr(tmpl.id));
        var addr = address_1.make(parent, tmpl.id);
        if (this.getThread(addr).isJust())
            return either_1.left(new errors.DuplicateAddressErr(addr));
        var args = Array.isArray(tmpl.args) ? tmpl.args : [];
        var act = tmpl.create.apply(tmpl, __spreadArrays([this.system, tmpl], args));
        // TODO: Have thread types depending on the actor type instead.
        var thr = new shared_1.SharedThread(this, factory_1.ScriptFactory.getScript(act), this.threadRunner, act.init(context_1.newContext(this._actorIdCounter++, act, addr, tmpl)));
        this.putThread(addr, thr);
        this.trigger(addr, events.EVENT_ACTOR_CREATED);
        if (flags_1.isRouter(thr.context.flags))
            this.putRoute(addr, addr);
        if (tmpl.group) {
            var groups = (typeof tmpl.group === 'string') ?
                [tmpl.group] : tmpl.group;
            groups.forEach(function (g) { return _this.putMember(g, addr); });
        }
        return either_1.right(addr);
    };
    PVM.prototype.runActor = function (target) {
        var mthread = this.getThread(target);
        if (mthread.isNothing())
            return future_1.raise(new errors.UnknownAddressErr(target));
        var rtime = mthread.get();
        var ft = rtime.context.actor.start(target);
        // Assumes the actor returned a Future
        if (ft)
            rtime.wait(ft);
        // Actors with this flag need to be brought down immediately.
        // TODO: Move this to the actors own run method after #47
        if (rtime.context.flags & flags_1.FLAG_EXIT_AFTER_RUN)
            rtime.wait(this.kill(rtime.context.actor, target));
        this.trigger(rtime.context.address, events.EVENT_ACTOR_STARTED);
    };
    PVM.prototype.sendMessage = function (to, from, msg) {
        var mRouter = this.getRouter(to);
        var mctx = mRouter.isJust() ?
            mRouter :
            this.getThread(to).map(function (r) { return r.context; });
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
                // TODO: Support async.
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
    PVM.prototype.getThread = function (addr) {
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
    PVM.prototype.putThread = function (addr, r) {
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
    PVM.prototype.raise = function (src, err) {
        var _this = this;
        var maddr = this.identify(src);
        // For now, ignore requests from unknown instances.
        if (maddr.isNothing())
            return;
        var addr = maddr.get();
        //TODO: pause the runtime.
        var next = addr;
        var _loop_1 = function () {
            var mrtime = this_1.getThread(next);
            //TODO: This risks swallowing errors.
            if (mrtime.isNothing())
                return { value: void 0 };
            var rtime = mrtime.get();
            var trap = rtime.context.template.trap ||
                (function () { return template.ACTION_RAISE; });
            switch (trap(err)) {
                case template.ACTION_IGNORE: return "break-loop";
                case template.ACTION_RESTART:
                    var maddr_1 = state_1.get(this_1.state, next);
                    if (maddr_1.isJust())
                        this_1.kill(maddr_1.get().context.actor, next)
                            .chain(function () {
                            var eRes = _this.allocate(address_1.getParent(next), rtime.context.template);
                            if (eRes.isLeft())
                                return future_1.raise(new Error(eRes.takeLeft().message));
                            _this.runActor(eRes.takeRight());
                            return future_1.voidPure;
                        }).fork(function (e) { return _this.raise(_this, e); });
                    return "break-loop";
                case template.ACTION_STOP:
                    var smaddr = state_1.get(this_1.state, next);
                    if (smaddr.isJust())
                        this_1.kill(smaddr.get().context.actor, next)
                            .fork(function (e) { return _this.raise(_this, e); });
                    return "break-loop";
                default:
                    if (next === address_1.ADDRESS_SYSTEM) {
                        if (err instanceof Error)
                            throw err;
                        throw new Error(err.message);
                    }
                    else {
                        next = address_1.getParent(next);
                    }
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
        this.conf.log.logger.debug.apply(null, __spreadArrays([
            "[" + r.context.address + "]",
            "(" + f.script.name + ")"
        ], op_1.toLog(op, r, f, oper)));
    };
    PVM.prototype.kill = function (parent, target) {
        var that = this;
        return future_1.doFuture(function () {
            var mparentAddr, parentAddr, addrs;
            return __generator(this, function (_a) {
                mparentAddr = that.identify(parent);
                // For now, ignore unknown kill requests.
                if (mparentAddr.isNothing())
                    return [2 /*return*/, future_1.pure(undefined)];
                parentAddr = mparentAddr.get();
                addrs = address_1.isGroup(target) ?
                    that.getGroup(target).orJust(function () { return []; }).get() : [target];
                return [2 /*return*/, runBatch(addrs.map(function (addr) { return future_1.doFuture(function () {
                        var err, mthread, thread, mchilds, childs, killChild;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if ((!address_1.isChild(parentAddr, target)) && (target !== parentAddr)) {
                                        err = new Error("IllegalStopErr: Actor \"" + parentAddr + "\" " +
                                            ("cannot kill non-child \"" + addr + "\"!"));
                                        that.raise(parent, err);
                                        return [2 /*return*/, future_1.raise(err)];
                                    }
                                    mthread = that.getThread(addr);
                                    if (mthread.isNothing())
                                        return [2 /*return*/, future_1.pure(undefined)];
                                    thread = mthread.get();
                                    mchilds = that.getChildren(target);
                                    childs = mchilds.isJust() ? mchilds.get() : {};
                                    killChild = function (child, addr) {
                                        return future_1.doFuture(function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, child.die()];
                                                    case 1:
                                                        _a.sent();
                                                        that.remove(addr);
                                                        that.trigger(addr, events.EVENT_ACTOR_STOPPED);
                                                        return [2 /*return*/, future_1.voidPure];
                                                }
                                            });
                                        });
                                    };
                                    return [4 /*yield*/, runBatch(record_1.mapTo(record_1.map(childs, killChild), function (f) { return f; }))];
                                case 1:
                                    _a.sent();
                                    if (!(addr !== address_1.ADDRESS_SYSTEM)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, killChild(thread, addr)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, future_1.voidPure];
                            }
                        });
                    }); }))];
            });
        });
    };
    /**
     * tell allows the vm to send a message to another actor via opcodes.
     *
     * If you want to immediately deliver a message, use [[sendMessage]] instead.
     */
    PVM.prototype.tell = function (ref, msg) {
        this.exec(this, 'tell', [ref, msg]);
        return this;
    };
    PVM.prototype.exec = function (actor, funName, args) {
        if (args === void 0) { args = []; }
        var mAddress = this.identify(actor);
        if (mAddress.isNothing())
            return this.raise(this, new errors.UnknownInstanceErr(actor));
        var thread = (this.state.threads[mAddress.get()]);
        thread.exec(funName, args);
    };
    return PVM;
}());
exports.PVM = PVM;
var runBatch = function (work) {
    return future_1.doFuture(function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, future_1.batch(array_1.distribute(work, exports.MAX_WORK_LOAD))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, future_1.voidPure];
            }
        });
    });
};
var normalize = function (spawnable) {
    var tmpl = (type_1.isFunction(spawnable) ?
        { create: spawnable } :
        spawnable);
    tmpl.id = tmpl.id ? tmpl.id : ID_RANDOM;
    return record_1.merge(tmpl, {
        children: record_1.isRecord(tmpl.children) ?
            record_1.mapTo(tmpl.children, function (c, k) { return record_1.merge(c, { id: k }); }) :
            tmpl.children ? tmpl.children : []
    });
};
//# sourceMappingURL=index.js.map