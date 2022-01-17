"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PVM = exports.MAX_WORK_LOAD = void 0;
const template = require("../../template");
const errors = require("./runtime/error");
const events = require("./event");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const type_1 = require("@quenk/noni/lib/data/type");
const either_1 = require("@quenk/noni/lib/data/either");
const array_1 = require("@quenk/noni/lib/data/array");
const record_1 = require("@quenk/noni/lib/data/record");
const address_1 = require("../../address");
const flags_1 = require("../../flags");
const message_1 = require("../../message");
const scheduler_1 = require("./thread/shared/scheduler");
const shared_1 = require("./thread/shared");
const state_1 = require("./state");
const context_1 = require("./runtime/context");
const op_1 = require("./runtime/op");
const conf_1 = require("./conf");
const log_1 = require("./log");
const ledger_1 = require("./runtime/heap/ledger");
const factory_1 = require("./scripts/factory");
const event_1 = require("./event");
const ID_RANDOM = `#?POTOORAND?#${Date.now()}`;
exports.MAX_WORK_LOAD = 25;
/**
 * PVM (Potoo Virtual Machine) is a JavaScript implemented virtual machine that
 * functions as a message delivery system between target actors.
 *
 * Actors known to the VM are considered to be part of a system and may or may
 * not reside on the same process/worker/thread depending on the underlying
 * platform and individual actor implementations.
 */
class PVM {
    constructor(system, conf = (0, conf_1.defaults)()) {
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
        this.threadRunner = new scheduler_1.SharedScheduler(this);
        /**
         * state contains information about all the actors in the system, routers
         * and groups.
         */
        this.state = {
            threads: {
                $: new shared_1.SharedThread(this, factory_1.ScriptFactory.getScript(this), this.threadRunner, (0, context_1.newContext)(this._actorIdCounter++, this, '$', {
                    create: () => this,
                    trap: () => template.ACTION_RAISE
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
    static create(s, conf = {}) {
        return new PVM(s, (0, record_1.rmerge)((0, conf_1.defaults)(), conf));
    }
    init(c) {
        return c;
    }
    accept(m) {
        return this.conf.accept(m);
    }
    start() { }
    notify() { }
    stop() {
        return this.kill(this, address_1.ADDRESS_SYSTEM);
    }
    identify(inst) {
        return (0, state_1.getAddress)(this.state, inst);
    }
    spawn(parent, tmpl) {
        let mparentAddr = this.identify(parent);
        if (mparentAddr.isNothing()) {
            this.raise(this, new errors.UnknownInstanceErr(parent));
            return '?';
        }
        return this._spawn(mparentAddr.get(), normalize(tmpl));
    }
    _spawn(parent, tmpl) {
        let eresult = this.allocate(parent, tmpl);
        if (eresult.isLeft()) {
            this.raise(this.state.threads[parent].context.actor, eresult.takeLeft());
            return '?';
        }
        let result = eresult.takeRight();
        this.runActor(result);
        if (Array.isArray(tmpl.children))
            // TODO: Make this call stack friendly some day.
            tmpl.children.forEach(tmp => this._spawn(result, tmp));
        return result;
    }
    allocate(parent, tmpl) {
        if (tmpl.id === ID_RANDOM) {
            let rtime = (0, state_1.get)(this.state, parent).get();
            let prefix = rtime.context.actor.constructor.name.toLowerCase();
            tmpl.id = `actor::${this._actorIdCounter + 1}~${prefix}`;
        }
        if ((0, address_1.isRestricted)(tmpl.id))
            return (0, either_1.left)(new errors.InvalidIdErr(tmpl.id));
        let addr = (0, address_1.make)(parent, tmpl.id);
        if (this.getThread(addr).isJust())
            return (0, either_1.left)(new errors.DuplicateAddressErr(addr));
        let args = Array.isArray(tmpl.args) ? tmpl.args : [];
        let act = tmpl.create(this.system, tmpl, ...args);
        // TODO: Have thread types depending on the actor type instead.
        let thr = new shared_1.SharedThread(this, factory_1.ScriptFactory.getScript(act), this.threadRunner, act.init((0, context_1.newContext)(this._actorIdCounter++, act, addr, tmpl)));
        this.putThread(addr, thr);
        this.trigger(addr, events.EVENT_ACTOR_CREATED);
        if ((0, flags_1.isRouter)(thr.context.flags))
            this.putRoute(addr, addr);
        if (tmpl.group) {
            let groups = (typeof tmpl.group === 'string') ?
                [tmpl.group] : tmpl.group;
            groups.forEach(g => this.putMember(g, addr));
        }
        return (0, either_1.right)(addr);
    }
    runActor(target) {
        let mthread = this.getThread(target);
        if (mthread.isNothing())
            return (0, future_1.raise)(new errors.UnknownAddressErr(target));
        let rtime = mthread.get();
        let ft = rtime.context.actor.start(target);
        // Assumes the actor returned a Future
        if (ft)
            rtime.wait(ft);
        // Actors with this flag need to be brought down immediately.
        // TODO: Move this to the actors own run method after #47
        if (rtime.context.flags & flags_1.FLAG_EXIT_AFTER_RUN)
            rtime.wait(this.kill(rtime.context.actor, target));
        this.trigger(rtime.context.address, events.EVENT_ACTOR_STARTED);
    }
    sendMessage(to, from, msg) {
        let mRouter = this.getRouter(to);
        let mctx = mRouter.isJust() ?
            mRouter :
            this.getThread(to).map(r => r.context);
        //routers receive enveloped messages.
        let actualMessage = mRouter.isJust() ?
            new message_1.Envelope(to, from, msg) : msg;
        if (mctx.isJust()) {
            let ctx = mctx.get();
            if ((0, flags_1.isBuffered)(ctx.flags)) {
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
    }
    getThread(addr) {
        return (0, state_1.get)(this.state, addr);
    }
    getRouter(addr) {
        return (0, state_1.getRouter)(this.state, addr).map(r => r.context);
    }
    getGroup(name) {
        return (0, state_1.getGroup)(this.state, name.split('$').join(''));
    }
    getChildren(addr) {
        return (0, maybe_1.fromNullable)((0, state_1.getChildren)(this.state, addr));
    }
    putThread(addr, r) {
        this.state = (0, state_1.put)(this.state, addr, r);
        return this;
    }
    putMember(group, addr) {
        (0, state_1.putMember)(this.state, group, addr);
        return this;
    }
    putRoute(target, router) {
        (0, state_1.putRoute)(this.state, target, router);
        return this;
    }
    remove(addr) {
        this.state = (0, state_1.remove)(this.state, addr);
        (0, record_1.map)(this.state.routers, (r, k) => {
            if (r === addr)
                delete this.state.routers[k];
        });
        return this;
    }
    removeRoute(target) {
        (0, state_1.removeRoute)(this.state, target);
        return this;
    }
    raise(src, err) {
        let maddr = this.identify(src);
        // For now, ignore requests from unknown instances.
        if (maddr.isNothing())
            return;
        let addr = maddr.get();
        //TODO: pause the runtime.
        let next = addr;
        loop: while (true) {
            let mrtime = this.getThread(next);
            //TODO: This risks swallowing errors.
            if (mrtime.isNothing())
                return;
            let rtime = mrtime.get();
            let trap = rtime.context.template.trap ||
                (() => template.ACTION_RAISE);
            switch (trap(err)) {
                case template.ACTION_IGNORE:
                    break loop;
                case template.ACTION_RESTART:
                    let maddr = (0, state_1.get)(this.state, next);
                    if (maddr.isJust())
                        this
                            .kill(maddr.get().context.actor, next)
                            .chain(() => {
                            let eRes = this.allocate((0, address_1.getParent)(next), rtime.context.template);
                            if (eRes.isLeft())
                                return (0, future_1.raise)(new Error(eRes.takeLeft().message));
                            this.runActor(eRes.takeRight());
                            return future_1.voidPure;
                        }).fork(e => this.raise(this, e));
                    break loop;
                case template.ACTION_STOP:
                    let smaddr = (0, state_1.get)(this.state, next);
                    if (smaddr.isJust())
                        this.kill(smaddr.get().context.actor, next)
                            .fork(e => this.raise(this, e));
                    break loop;
                default:
                    if (next === address_1.ADDRESS_SYSTEM) {
                        if (err instanceof Error)
                            throw err;
                        throw new Error(err.message);
                    }
                    else {
                        next = (0, address_1.getParent)(next);
                    }
                    break;
            }
        }
    }
    trigger(addr, evt, ...args) {
        let elvl = (0, event_1.getLevel)(evt);
        let { level, logger } = this.conf.log;
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
            this.conf.on[evt].apply(null, [addr, evt, ...args]);
    }
    logOp(r, f, op, oper) {
        this.conf.log.logger.debug.apply(null, [
            `[${r.context.address}]`,
            `(${f.script.name})`,
            ...(0, op_1.toLog)(op, r, f, oper)
        ]);
    }
    kill(parent, target) {
        let that = this;
        return (0, future_1.doFuture)(function* () {
            let mparentAddr = that.identify(parent);
            // For now, ignore unknown kill requests.
            if (mparentAddr.isNothing())
                return (0, future_1.pure)(undefined);
            let parentAddr = mparentAddr.get();
            let addrs = (0, address_1.isGroup)(target) ?
                that.getGroup(target).orJust(() => []).get() : [target];
            return runBatch(addrs.map(addr => (0, future_1.doFuture)(function* () {
                if ((!(0, address_1.isChild)(parentAddr, target)) && (target !== parentAddr)) {
                    let err = new Error(`IllegalStopErr: Actor "${parentAddr}" ` +
                        `cannot kill non-child "${addr}"!`);
                    that.raise(parent, err);
                    return (0, future_1.raise)(err);
                }
                let mthread = that.getThread(addr);
                if (mthread.isNothing())
                    return (0, future_1.pure)(undefined);
                let thread = mthread.get();
                let mchilds = that.getChildren(target);
                let childs = mchilds.isJust() ? mchilds.get() : {};
                let killChild = (child, addr) => (0, future_1.doFuture)(function* () {
                    yield child.die();
                    that.remove(addr);
                    that.trigger(addr, events.EVENT_ACTOR_STOPPED);
                    return future_1.voidPure;
                });
                yield runBatch((0, record_1.mapTo)((0, record_1.map)(childs, killChild), f => f));
                if (addr !== address_1.ADDRESS_SYSTEM)
                    yield killChild(thread, addr);
                return future_1.voidPure;
            })));
        });
    }
    /**
     * tell allows the vm to send a message to another actor via opcodes.
     *
     * If you want to immediately deliver a message, use [[sendMessage]] instead.
     */
    tell(ref, msg) {
        this.exec(this, 'tell', [this.heap.string(ref), this.heap.object(msg)]);
        return this;
    }
    exec(actor, funName, args = []) {
        let mAddress = this.identify(actor);
        if (mAddress.isNothing())
            return this.raise(this, new errors.UnknownInstanceErr(actor));
        let thread = (this.state.threads[mAddress.get()]);
        thread.exec(funName, args);
    }
}
exports.PVM = PVM;
const runBatch = (work) => (0, future_1.doFuture)(function* () {
    yield (0, future_1.batch)((0, array_1.distribute)(work, exports.MAX_WORK_LOAD));
    return future_1.voidPure;
});
const normalize = (spawnable) => {
    let tmpl = ((0, type_1.isFunction)(spawnable) ?
        { create: spawnable } :
        spawnable);
    tmpl.id = tmpl.id ? tmpl.id : ID_RANDOM;
    return (0, record_1.merge)(tmpl, {
        children: (0, record_1.isRecord)(tmpl.children) ?
            (0, record_1.mapTo)(tmpl.children, (c, k) => (0, record_1.merge)(c, { id: k })) :
            tmpl.children ? tmpl.children : []
    });
};
//# sourceMappingURL=index.js.map