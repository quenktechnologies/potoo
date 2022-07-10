"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ref = exports.AbstractResident = void 0;
const record_1 = require("@quenk/noni/lib/data/record");
const type_1 = require("@quenk/noni/lib/data/type");
const error_1 = require("../system/vm/runtime/error");
const flags_1 = require("../flags");
/**
 * AbstractResident is a base implementation of a Resident actor.
 */
class AbstractResident {
    constructor(system) {
        this.system = system;
        this.self = getSelf(this);
    }
    get platform() {
        return this.system.getPlatform();
    }
    init(c) {
        c.flags = c.flags | flags_1.FLAG_VM_THREAD;
        return c;
    }
    notify() {
        this.platform.exec(this, 'notify');
    }
    accept(_) { }
    spawn(t) {
        return this.system.getPlatform().spawn(this, t);
    }
    spawnGroup(group, tmpls) {
        return (0, record_1.map)(tmpls, (t) => this.spawn((0, type_1.isObject)(t) ?
            (0, record_1.merge)(t, { group: group }) : { group, create: t }));
    }
    tell(ref, msg) {
        let { heap } = this.platform;
        this.exec('tell', [heap.string(ref), heap.object(msg)]);
        return this;
    }
    raise(e) {
        this.system.getPlatform().raise(this, e);
        return this;
    }
    kill(addr) {
        let { heap } = this.platform;
        this.exec('kill', [heap.string(addr)]);
        return this;
    }
    exit() {
        this.kill(this.self());
    }
    start(addr) {
        this.self = () => addr;
        return this.run();
    }
    run() { }
    stop() { }
    wait(ft) {
        let mthread = this.platform.actors.getThread(this.self());
        if (mthread.isJust())
            mthread.get().wait(ft);
        else
            this.raise(new error_1.UnknownInstanceErr(this));
    }
    /**
     * exec calls a VM function by name on behalf of this actor.
     */
    exec(fname, args) {
        this.platform.exec(this, fname, args);
    }
}
exports.AbstractResident = AbstractResident;
/**
 * ref produces a function for sending messages to an actor address.
 */
const ref = (res, addr) => (m) => res.tell(addr, m);
exports.ref = ref;
const getSelf = (actor) => {
    let _self = '?';
    return () => {
        if (_self === '?')
            _self = actor
                .system
                .getPlatform()
                .identify(actor)
                .orJust(() => '?').get();
        return _self;
    };
};
//# sourceMappingURL=index.js.map