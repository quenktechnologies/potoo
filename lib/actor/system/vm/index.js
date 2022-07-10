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
const thread_1 = require("./thread");
const context_1 = require("./runtime/context");
const conf_1 = require("./conf");
const log_1 = require("./log");
const ledger_1 = require("./runtime/heap/ledger");
const factory_1 = require("./scripts/factory");
const event_1 = require("./event");
const groups_1 = require("./groups");
const table_1 = require("./table");
const routers_1 = require("./routers");
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
        this._context = (0, context_1.newContext)(this._actorIdCounter++, this, '$', {
            create: () => this,
            trap: () => template.ACTION_RAISE
        });
        /**
         * scheduler shared between vm threads.
         */
        this.scheduler = new scheduler_1.SharedScheduler(this);
        this.heap = new ledger_1.DefaultHeapLedger();
        this.log = new log_1.LogWriter(this.conf.long_sink, this.conf.log_level);
        this.events = new event_1.Publisher(this.log);
        this.actors = new table_1.ActorTable({
            $: {
                context: this._context,
                thread: (0, maybe_1.just)(new shared_1.SharedThread(this, factory_1.ScriptFactory.getScript(this), this.scheduler, this._context))
            }
        });
        /**
         * routers configured to handle any address that falls underneath them.
         */
        this.routers = new routers_1.RouterMap();
        /**
         * groups combine multiple addresses into one.
         */
        this.groups = new groups_1.GroupMap();
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
        return this.actors.addressFromActor(inst);
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
            let mparentActor = this.actors.get(parent);
            if (mparentActor.isJust())
                this.raise(mparentActor.get().context.actor, eresult.takeLeft());
            return '?';
        }
        let result = eresult.takeRight();
        this.runActor(result);
        // TODO: Make this call stack friendly some day.
        if (Array.isArray(tmpl.children))
            tmpl.children.forEach(tmp => this._spawn(result, tmp));
        return result;
    }
    allocate(parent, tmpl) {
        if (tmpl.id === ID_RANDOM) {
            let actor = this.actors.get(parent).get().context.actor;
            let prefix = actor.constructor.name.toLowerCase();
            tmpl.id = `actor::${this._actorIdCounter + 1}~${prefix}`;
        }
        if ((0, address_1.isRestricted)(tmpl.id))
            return (0, either_1.left)(new errors.InvalidIdErr(tmpl.id));
        let addr = (0, address_1.make)(parent, tmpl.id);
        if (this.actors.has(addr))
            return (0, either_1.left)(new errors.DuplicateAddressErr(addr));
        let args = Array.isArray(tmpl.args) ? tmpl.args : [];
        let actor = tmpl.create(this.system, tmpl, ...args);
        let context = actor.init((0, context_1.newContext)(this._actorIdCounter++, actor, addr, tmpl));
        let thread = (0, flags_1.usesVMThread)(context.flags) ?
            (0, maybe_1.just)(new shared_1.SharedThread(this, factory_1.ScriptFactory.getScript(actor), this.scheduler, context)) : (0, maybe_1.nothing)();
        this.actors.set(addr, { thread, context });
        this.events.publish(addr, events.EVENT_ACTOR_CREATED);
        if ((0, flags_1.isRouter)(context.flags))
            this.routers.set(addr, addr);
        if (tmpl.group) {
            let groups = Array.isArray(tmpl.group) ? tmpl.group : [tmpl.group];
            groups.forEach(group => this.groups.put(group, addr));
        }
        return (0, either_1.right)(addr);
    }
    runActor(target) {
        if (!this.actors.has(target))
            return (0, future_1.raise)(new errors.UnknownAddressErr(target));
        let ate = this.actors.get(target).get();
        let ft = ate.context.actor.start(target);
        if (ft) {
            // Assumes the actor returned a Future.
            if (ate.thread.isNothing()) {
                ft.fork(e => this.raise(ate.context.actor, e));
            }
            else {
                let thread = ate.thread.get();
                if (ft)
                    thread.wait(ft);
                // Actors with this flag need to be brought down immediately.
                // TODO: Move this to the actors own run method after #47
                if (ate.context.flags & flags_1.FLAG_EXIT_AFTER_RUN)
                    thread.wait(this.kill(ate.context.actor, target));
            }
        }
        this.events.publish(ate.context.address, events.EVENT_ACTOR_STARTED);
    }
    sendMessage(to, from, msg) {
        this.events.publish(from, events.EVENT_SEND_START, to, from, msg);
        let mRouter = this.routers.getFor(to)
            .chain(addr => this.actors.get(addr))
            .map(ate => ate.context);
        let mctx = mRouter.isJust() ?
            mRouter :
            this.actors.get(to).map(ate => ate.context);
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
            this.events.publish(from, events.EVENT_SEND_OK, to, msg);
            return true;
        }
        else {
            this.events.publish(from, events.EVENT_SEND_FAILED, to, msg);
            return false;
        }
    }
    raise(src, err) {
        let maddr = this.identify(src);
        // For now, ignore requests from unknown instances.
        if (maddr.isNothing())
            return;
        let addr = maddr.get();
        //TODO: pause the thread if one is used.
        let next = addr;
        loop: while (true) {
            let mate = this.actors.get(next);
            //TODO: This risks swallowing errors.
            if (mate.isNothing())
                return;
            let ate = mate.get();
            let trap = ate.context.template.trap ||
                (() => template.ACTION_RAISE);
            switch (trap(err)) {
                case template.ACTION_IGNORE:
                    // TODO: do this via a method.
                    ate.thread.map(thr => {
                        thr.state = thread_1.THREAD_STATE_IDLE;
                    });
                    break loop;
                case template.ACTION_RESTART:
                    let mate = this.actors.get(next);
                    if (mate.isJust())
                        this
                            .kill(mate.get().context.actor, next)
                            .chain(() => {
                            let eRes = this.allocate((0, address_1.getParent)(next), ate.context.template);
                            if (eRes.isLeft())
                                return (0, future_1.raise)(new Error(eRes.takeLeft().message));
                            this.runActor(eRes.takeRight());
                            return future_1.voidPure;
                        }).fork(e => this.raise(this, e));
                    break loop;
                case template.ACTION_STOP:
                    let smate = this.actors.get(next);
                    if (smate.isJust())
                        this.kill(smate.get().context.actor, next)
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
    kill(parent, target) {
        let that = this;
        return (0, future_1.doFuture)(function* () {
            let mparentAddr = that.identify(parent);
            // For now, ignore unknown kill requests.
            if (mparentAddr.isNothing())
                return (0, future_1.pure)(undefined);
            let parentAddr = mparentAddr.get();
            let targets = (0, address_1.isGroup)(target) ?
                that.groups.get(target).orJust(() => []).get() : [target];
            return runBatch(targets.map((next) => (0, future_1.doFuture)(function* () {
                if ((!(0, address_1.isChild)(parentAddr, target)) &&
                    (target !== parentAddr)) {
                    let err = new Error(`IllegalStopErr: Actor "${parentAddr}" ` +
                        `cannot kill non-child "${next}"!`);
                    that.raise(parent, err);
                    return (0, future_1.raise)(err);
                }
                let mentry = that.actors.get(next);
                if (mentry.isNothing())
                    return (0, future_1.pure)(undefined);
                let killChild = (ate) => (0, future_1.doFuture)(function* () {
                    if (ate.thread.isJust())
                        // The thread will clean up.
                        yield ate.thread.get().die();
                    else
                        yield (0, future_1.wrap)(ate.context.actor.stop());
                    let { address } = ate.context;
                    that.actors.remove(address);
                    that.events.publish(address, events.EVENT_ACTOR_STOPPED);
                    return future_1.voidPure;
                });
                yield runBatch(that.actors.getChildren(next)
                    .reverse().map(killChild));
                if (next !== address_1.ADDRESS_SYSTEM)
                    yield killChild(mentry.get());
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
        let thread;
        if (actor === this) {
            thread = this.actors.getThread('$').get();
        }
        else {
            let mAddress = this.identify(actor);
            if (mAddress.isNothing())
                return this.raise(this, new errors.UnknownInstanceErr(actor));
            thread = this.actors.getThread(mAddress.get()).get();
        }
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