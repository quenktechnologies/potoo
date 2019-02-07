"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var child_process_1 = require("child_process");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var match_1 = require("@quenk/noni/lib/control/match");
var type_1 = require("@quenk/noni/lib/data/type");
var scripts_1 = require("../resident/scripts");
var scripts_2 = require("../system/vm/runtime/scripts");
var op_1 = require("../system/vm/op");
var address_1 = require("../address");
var scripts_3 = require("./scripts");
exports.SCRIPT_PATH = __dirname + "/../../../lib/actor/process/script.js";
var raiseShape = {
    code: op_1.OP_CODE_RAISE,
    src: String,
    dest: String,
    error: { message: String }
};
var tellShape = {
    code: op_1.OP_CODE_TELL,
    to: String,
    from: String,
    message: type_1.Any
};
/**
 * Process actor.
 *
 * This actor works by dynamically spawning a new system in another
 * process and routing messages between it and the parent process.
 *
 * The module argument must be the absolute path to a script file
 * that exports a function called "create" that corresponds to the
 * Template interface's create function.
 *
 * The actor created by that function will received a "serialized"
 * copy of all messages the parent process sends to this one.
 *
 * We use node's builtin child_process API to monitor and receive
 * messages from the child process.
 */
var Process = /** @class */ (function () {
    function Process(module, system, script) {
        if (script === void 0) { script = exports.SCRIPT_PATH; }
        var _this = this;
        this.module = module;
        this.system = system;
        this.script = script;
        this.process = maybe_1.nothing();
        this.self = function () { return _this.system.ident(_this); };
    }
    Process.prototype.init = function (c) {
        c.flags.immutable = true;
        c.flags.buffered = false;
        c.flags.router = true;
        return c;
    };
    Process.prototype.accept = function (e) {
        if (this.process.isJust()) {
            var p = this.process.get();
            p.send(e);
        }
        else {
            this.system.exec(this, new scripts_1.AcceptScript(e));
        }
        return this;
    };
    Process.prototype.notify = function () { };
    Process.prototype.stop = function () {
        if (this.process.isJust()) {
            this.process.get().kill();
            this.process = maybe_1.nothing();
        }
    };
    Process.prototype.run = function () {
        this.process =
            maybe_1.just(child_process_1.fork(path_1.resolve(this.script), [], spawnOpts(this)))
                .map(handleErrors(this))
                .map(handleMessages(this))
                .map(handleExit(this));
    };
    return Process;
}());
exports.Process = Process;
var spawnOpts = function (p) { return ({
    env: {
        POTOO_ACTOR_ID: address_1.getId(p.self()),
        POTOO_ACTOR_ADDRESS: p.self(),
        POTOO_ACTOR_MODULE: p.module
    }
}); };
var handleMessages = function (p) { return function (c) {
    return c.on('message', filterMessage(p));
}; };
var filterMessage = function (p) { return function (m) {
    return match_1.match(m)
        .caseOf(tellShape, handleTell(p))
        .caseOf(raiseShape, handleRaise(p))
        .orElse(handleUnknown(p))
        .end();
}; };
var handleUnknown = function (p) { return function (m) {
    return p.system.exec(p, new scripts_1.AcceptScript(m));
}; };
var handleTell = function (p) { return function (m) {
    return p.system.exec(p, new scripts_1.TellScript(m.to, m.message));
}; };
var handleRaise = function (p) { return function (_a) {
    var message = _a.error.message, src = _a.src;
    return p.system.exec(p, new scripts_3.RaiseScript("Error message from " + src + ": " + message));
}; };
var handleErrors = function (p) { return function (c) {
    return c.on('error', raise(p));
}; };
var raise = function (p) { return function (e) {
    return p.system.exec(p, new scripts_3.RaiseScript(e.message));
}; };
var handleExit = function (p) { return function (c) {
    return c.on('exit', function () { return p.system.exec(p, new scripts_2.StopScript(p.self())); });
}; };
//# sourceMappingURL=index.js.map