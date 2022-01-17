"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = exports.SCRIPT_PATH = void 0;
const path_1 = require("path");
const child_process_1 = require("child_process");
const match_1 = require("@quenk/noni/lib/control/match");
const type_1 = require("@quenk/noni/lib/data/type");
const op_1 = require("../system/vm/runtime/op");
const address_1 = require("../address");
const flags_1 = require("../flags");
const address_2 = require("../address");
exports.SCRIPT_PATH = `${__dirname}/../../../lib/actor/process/script.js`;
const raiseShape = {
    code: op_1.RAISE,
    src: String,
    dest: String,
    message: String,
    stack: String
};
const tellShape = {
    code: op_1.SEND,
    to: String,
    from: String,
    message: type_1.Any
};
/**
 * Process actor.
 *
 * This actor works by spawning a VM in another process to route messages
 * between it and it's parent.
 *
 * The module argument must be an absolute path to a script file
 * that exports a function "create". This has to correspond with the
 * Template interface's create function.
 *
 * The actor created by that function will received a "stringified"
 * copy of all messages bound for it from the parent process.
 *
 * Node's builtin child_process API to monitor and receive
 * messages from the child process.
 */
class Process {
    constructor(module, system, script = exports.SCRIPT_PATH) {
        this.module = module;
        this.system = system;
        this.script = script;
        this.process = nullHandle;
        this.self = () => address_2.ADDRESS_DISCARD;
    }
    init(c) {
        c.flags = c.flags | flags_1.FLAG_IMMUTABLE | flags_1.FLAG_ROUTER;
        return c;
    }
    accept(e) {
        this.process.send(e);
        return this;
    }
    notify() { }
    stop() {
        this.process.kill();
    }
    start(addr) {
        this.self = () => addr;
        let p = (0, child_process_1.fork)((0, path_1.resolve)(this.script), [], spawnOpts(this));
        p.on('error', e => this.system.getPlatform().raise(this, e));
        //TODO: What should we do with invalid messages?
        p.on('message', (m) => (0, match_1.match)(m)
            .caseOf(tellShape, handleTell(this))
            .caseOf(raiseShape, handleRaise(this))
            .orElse(() => { })
            .end());
        p.on('exit', () => {
            this.process = nullHandle;
            this.system.getPlatform().kill(this, this.self());
        });
        this.process = p;
    }
}
exports.Process = Process;
const nullHandle = {
    send() { },
    kill() { }
};
const spawnOpts = (p) => ({
    env: {
        POTOO_ACTOR_ID: (0, address_1.getId)(p.self()),
        POTOO_ACTOR_ADDRESS: p.self(),
        POTOO_ACTOR_MODULE: p.module,
        POTOO_PVM_CONF: process.env.POTOO_PVM_CONF
    }
});
const handleTell = (p) => (m) => p.system.getPlatform().tell(m.to, m.message);
const handleRaise = (p) => ({ message, stack }) => {
    let err = new Error(message);
    err.stack = stack;
    p.system.getPlatform().raise(p, err);
};
//# sourceMappingURL=index.js.map