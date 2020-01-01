"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var template = require("../../../template");
var logging = require("../../log");
var error_1 = require("@quenk/noni/lib/control/error");
var array_1 = require("@quenk/noni/lib/data/array");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var address_1 = require("../../../address");
var state_1 = require("../../state");
var frame_1 = require("../frame");
var scripts_1 = require("./scripts");
/**
 * This is an implementation of Runtime for exactly one
 * actor.
 *
 * It has all the methods and properties expected for Op code execution.
 */
var This = /** @class */ (function () {
    function This(self, system, stack, queue) {
        if (stack === void 0) { stack = []; }
        if (queue === void 0) { queue = []; }
        this.self = self;
        this.system = system;
        this.stack = stack;
        this.queue = queue;
        this.running = false;
    }
    This.prototype.config = function () {
        return this.system.configuration;
    };
    This.prototype.current = function () {
        return (this.stack.length > 0) ?
            maybe_1.just(array_1.tail(this.stack)) :
            maybe_1.nothing();
    };
    This.prototype.allocate = function (addr, t) {
        var h = new This(addr, this.system);
        var args = Array.isArray(t.args) ? t.args : [];
        var act = t.create.apply(t, __spreadArrays([this.system], args));
        return act.init(this.system.allocate(act, h, t));
    };
    This.prototype.getContext = function (addr) {
        return state_1.get(this.system.state, addr);
    };
    This.prototype.getRouter = function (addr) {
        return state_1.getRouter(this.system.state, addr);
    };
    This.prototype.getGroup = function (name) {
        return state_1.getGroup(this.system.state, name.split('$').join(''));
    };
    This.prototype.getChildren = function (addr) {
        return maybe_1.fromNullable(state_1.getChildren(this.system.state, addr));
    };
    This.prototype.putContext = function (addr, ctx) {
        this.system.state = state_1.put(this.system.state, addr, ctx);
        return this;
    };
    This.prototype.removeContext = function (addr) {
        this.system.state = state_1.remove(this.system.state, addr);
        return this;
    };
    This.prototype.putRoute = function (target, router) {
        state_1.putRoute(this.system.state, target, router);
        return this;
    };
    This.prototype.removeRoute = function (target) {
        state_1.removeRoute(this.system.state, target);
        return this;
    };
    This.prototype.putMember = function (group, addr) {
        state_1.putMember(this.system.state, group, addr);
        return this;
    };
    This.prototype.removeMember = function (group, addr) {
        state_1.removeMember(this.system.state, group, addr);
        return this;
    };
    This.prototype.push = function (f) {
        this.stack.push(f);
        return this;
    };
    This.prototype.clear = function () {
        this.stack = [];
        return this;
    };
    This.prototype.drop = function (m) {
        var policy = (this.system.configuration.log || {});
        var level = policy.level || 0;
        var logger = policy.logger || console;
        if (level > logging.WARN) {
            logger.warn("[" + this.self + "]: Dropped ", m);
        }
        return this;
    };
    This.prototype.raise = function (err) {
        var _this = this;
        var self = this.self;
        this
            .getContext(self)
            .chain(function (ctx) {
            return maybe_1.fromNullable(ctx.template.trap)
                .map(function (trap) {
                switch (trap(err)) {
                    case template.ACTION_IGNORE:
                        break;
                    case template.ACTION_RESTART:
                        _this.exec(new scripts_1.RestartScript());
                        break;
                    case template.ACTION_STOP:
                        _this.exec(new scripts_1.StopScript(self));
                        break;
                    default:
                        _this.exec(new scripts_1.StopScript(self));
                        escalate(_this.system, self, err);
                        break;
                }
            });
        })
            .orJust(function () {
            _this.exec(new scripts_1.StopScript(self));
            escalate(_this.system, self, err);
        });
    };
    This.prototype.exec = function (s) {
        var ctx = this.getContext(this.self).get();
        if (this.running) {
            this.queue.push(new frame_1.Frame(this.self, ctx, s, s.code));
        }
        else {
            this.push(new frame_1.Frame(this.self, ctx, s, s.code));
        }
        return this.run();
    };
    This.prototype.run = function () {
        var policy = (this.system.configuration.log || {});
        var ret = maybe_1.nothing();
        if (this.running)
            return ret;
        this.running = true;
        while (true) {
            var cur = array_1.tail(this.stack);
            while (true) {
                if (array_1.tail(this.stack) !== cur)
                    break;
                if (cur.ip === cur.code.length) {
                    //XXX: We should really always push the top most to the next
                    if ((this.stack.length > 1) && (cur.data.length > 0)) {
                        var _a = cur.pop(), value = _a[0], type = _a[1], loc = _a[2];
                        this.stack[this.stack.length - 2].push(value, type, loc);
                    }
                    ret = cur.resolve(cur.pop()).toMaybe();
                    this.stack.pop();
                    break;
                }
                var next = log(policy, cur, cur.code[cur.ip]);
                cur.ip++; // increment here so jumps do not skip
                next.exec(this);
            }
            if (this.stack.length === 0) {
                if (this.queue.length > 0) {
                    this.stack.push(this.queue.shift());
                }
                else {
                    break;
                }
            }
        }
        this.running = false;
        return ret;
    };
    return This;
}());
exports.This = This;
var escalate = function (env, target, err) {
    return state_1.get(env.state, address_1.getParent(target))
        .map(function (ctx) { return ctx.runtime.raise(err); })
        .orJust(function () { throw error_1.convert(err); });
};
var log = function (policy, f, o) {
    var level = policy.level || 0;
    var logger = policy.logger || console;
    if (o.level <= level) {
        var ctx = "[" + f.actor + "]";
        var msg = __spreadArrays([ctx], resolveLog(f, o.toLog(f)));
        switch (o.level) {
            case logging.INFO:
                logger.info.apply(logger, msg);
                break;
            case logging.WARN:
                logger.warn.apply(logger, msg);
                break;
            case logging.ERROR:
                logger.error.apply(logger, msg);
                break;
            default:
                logger.log.apply(logger, msg);
                break;
        }
    }
    return o;
};
var resolveLog = function (f, _a) {
    var op = _a[0], rand = _a[1], data = _a[2];
    var operand = rand.length > 0 ?
        f
            .resolve(rand)
            .orRight(function () { return undefined; })
            .takeRight() : [];
    var stack = data.length > 0 ?
        data.map(function (d) {
            return f.resolve(d)
                .orRight(function () { return undefined; })
                .takeRight();
        }) : [];
    return [op, operand].concat(stack);
};
//# sourceMappingURL=this.js.map