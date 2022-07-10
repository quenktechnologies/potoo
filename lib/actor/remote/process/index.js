"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exit = exports.select = exports.receive = exports.tell = exports.self = exports.init = exports.VMProcess = exports.Process = exports.SCRIPT_PATH = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const match_1 = require("@quenk/noni/lib/control/match");
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const array_1 = require("@quenk/noni/lib/data/array");
const function_1 = require("@quenk/noni/lib/data/function");
const event_1 = require("../../system/vm/event");
const log_1 = require("../../system/vm/log");
const function_2 = require("../../resident/case/function");
const address_1 = require("../../address");
const flags_1 = require("../../flags");
const __1 = require("..");
exports.SCRIPT_PATH = `${__dirname}/../../../actor/remote/process/script.js`;
/**
 * Process actor for spawning remote actors in a Node.js child process.
 *
 * The child process is treated as a single actor in the system and can
 * communicate with the main process's VM via the relevant functions exported by
 * this module.
 *
 * The child process will have access to the following environment variables:
 *
 * 1. POTOO_ACTOR_ID -      The id of the Process actor's template.
 *
 * 2. POTOO_ACTOR_ADDRESS   The full address of the Process in the parent VM.
 *                          This will be used as the value for self().
 */
class Process {
    /**
     * @param system - The system the actor belongs to.
     * @param script - The script that will be executed in the child process.
     */
    constructor(system, script) {
        this.system = system;
        this.script = script;
        /**
         * handle is the child process spawned for this actor.
         */
        this.handle = (0, maybe_1.nothing)();
    }
    /**
     * spawnChildProcess spawns the Node.js child process using the provided
     * options.
     *
     * The following event handlers are installed on the child process:
     *
     * 1. "error"   - will raise through the error handling machinery.
     * 2. "message  - will forward messages in the correct format from the child
     *                process to other actors in the system.
     * 3. "exit"    - will signal to the VM to kill this actor.
     */
    spawnChildProcess(self, opts) {
        let handle = (0, child_process_1.fork)((0, path_1.resolve)(this.script), [], opts);
        handle.on('error', (e) => this.system.getPlatform().raise(this, e));
        handle.on('message', (m) => (0, match_1.match)(m)
            .caseOf(__1.shapes.raise, ({ message, stack }) => {
            let err = new Error(message);
            err.stack = stack;
            this.system.getPlatform().raise(this, err);
        })
            .caseOf(__1.shapes.send, (m) => {
            let vm = this.system.getPlatform();
            vm.sendMessage(m.to, m.from, m.message);
        })
            .caseOf(__1.shapes.drop, (m) => this
            .system
            .getPlatform()
            .events
            .publish(m.from, event_1.EVENT_SEND_FAILED, m.to, m.message))
            .orElse((m) => { console.error("SPC", m); })
            .end());
        handle.on('exit', () => {
            this.handle = (0, maybe_1.nothing)();
            this.system.getPlatform().kill(this, self);
        });
        return handle;
    }
    init(c) {
        c.flags = c.flags | flags_1.FLAG_IMMUTABLE | flags_1.FLAG_ROUTER;
        return c;
    }
    accept(e) {
        if (this.handle.isJust())
            this.handle.get().send(e);
        return this;
    }
    notify() { }
    stop() {
        if (this.handle.isJust())
            this.handle.get().kill();
    }
    start(addr) {
        this.handle = (0, maybe_1.just)(this.spawnChildProcess(addr, {
            env: {
                POTOO_ACTOR_ID: (0, address_1.getId)(addr),
                POTOO_ACTOR_ADDRESS: addr
            }
        }));
    }
}
exports.Process = Process;
/**
 * VMProcess spawns a child VM in a new Node.js process.
 *
 * This is different to the [[Process]] actor because it allows the child
 * process to maintain its own tree of actors, routing messaging between
 * it and the main process's VM.
 *
 * The sub-VM is created and setup via a script file local to this module.
 *
 * The child process will have access to the following environment variables:
 *
 * 1. POTOO_ACTOR_ID -      The id of the VMProcess actor's template. This
 *                          should be used as the id for the actor first actor
 *                          spawned.
 *
 * 2. POTOO_ACTOR_ADDRESS   The full address of the VMProcess in the parent VM.
 * 3. POTOO_ACTOR_MODULE    The path to a node module whose default export is a
 *                          function receiving a vm instance that produces a
 *                          template or list of templates to spawn.
 * 4. POTOO_PVM_CONF        A JSON.stringify() version of the main VM's conf.
 */
class VMProcess extends Process {
    /**
     * @param system     - The parent system.
     * @param module     - A path to a module that exports a system() function
     *                     that provides the System instance and a property
     *                     "spawnable" that is a Spawnable that will be spawned.
     *                     that will be spawned serving as the first actor.
     * @param [script]   - This is the script used to setup the child VM, it can
     *                     be overridden for a custom implementation.
     */
    constructor(system, module, script = exports.SCRIPT_PATH) {
        super(system, script);
        this.system = system;
        this.module = module;
        this.script = script;
    }
    init(c) {
        c.flags = c.flags | flags_1.FLAG_IMMUTABLE | flags_1.FLAG_ROUTER;
        return c;
    }
    start(addr) {
        this.handle = (0, maybe_1.just)(this.spawnChildProcess(addr, {
            env: {
                POTOO_ACTOR_ID: (0, address_1.getId)(addr),
                POTOO_ACTOR_ADDRESS: addr,
                POTOO_ACTOR_MODULE: this.module,
                POTOO_PVM_CONF: process.env.POTOO_PVM_CONF,
                POTOO_LOG_LEVEL: String(this.system.getPlatform().log.level)
            }
        }));
    }
}
exports.VMProcess = VMProcess;
const messages = [];
/**
 * init should be called as early as possible in the child process if using the
 * direct API (Process).
 *
 * It sets up a listener for incoming messages to the child_process that can
 * be read later via receive() or select().
 */
const init = () => {
    if (!process.send)
        throw new Error('process: direct API is meant to ' +
            'be used in a child process!');
    process.on('message', (m) => {
        if (m && m.to && m.message) {
            messages.unshift(m.message);
            doReceive();
        }
    });
    process.on('uncaughtExceptionMonitor', err => process.send(new __1.RemoteError(err)));
};
exports.init = init;
/**
 * self provides the address for this child actor.
 */
const self = () => process.env.POTOO_ACTOR_ADDRESS || address_1.ADDRESS_DISCARD;
exports.self = self;
/**
 * tell sends a message to another actor in the system using the VM in the
 * parent process.
 */
const tell = (to, msg) => process.send(new __1.Send(to, (0, exports.self)(), msg));
exports.tell = tell;
const receivers = [];
const doReceive = () => {
    if (!(0, array_1.empty)(receivers))
        receivers.pop()();
};
/**
 * receive the next message in the message queue.
 */
const receive = () => (0, future_1.run)((_, onSuccess) => {
    receivers.push(() => onSuccess(messages.pop()));
    if (!(0, array_1.empty)(messages))
        doReceive();
    return function_1.noop;
});
exports.receive = receive;
const writer = new log_1.LogWriter(console, Number(process.env.POTOO_LOG_LEVEL) || log_1.LOG_LEVEL_ERROR);
/**
 * select the next desired message in the message queue using a list of [[Case]]
 * classes.
 */
const select = (cases) => (0, future_1.run)((onError, onSuccess) => {
    let f = new function_2.CaseFunction(cases);
    receivers.push(() => {
        if (f.test((0, array_1.tail)(messages)))
            (0, future_1.wrap)(f.apply(messages.pop())).fork(onError, onSuccess);
        else
            writer.event((0, exports.self)(), event_1.EVENT_MESSAGE_DROPPED, messages.pop());
    });
    if (!(0, array_1.empty)(messages))
        doReceive();
    return function_1.noop;
});
exports.select = select;
/**
 * exist the actor.
 *
 * This is simply a wrapper around process.exit();
 */
const exit = () => process.exit();
exports.exit = exit;
//# sourceMappingURL=index.js.map