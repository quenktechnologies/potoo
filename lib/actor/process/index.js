"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var op = require("../system/op");
var path_1 = require("path");
var child_process_1 = require("child_process");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var match_1 = require("@quenk/noni/lib/control/match");
var type_1 = require("@quenk/noni/lib/data/type");
var raise_1 = require("../system/op/raise");
var kill_1 = require("../system/op/kill");
var drop_1 = require("../system/op/drop");
var tell_1 = require("../system/op/tell");
var route_1 = require("../system/op/route");
var address_1 = require("../address");
exports.SCRIPT_PATH = __dirname + "/../../../lib/actor/process/script.js";
var raiseShape = {
    code: op.OP_RAISE,
    src: String,
    dest: String,
    error: { message: String }
};
var tellShape = {
    code: op.OP_TELL,
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
    function Process(module, system) {
        var _this = this;
        this.module = module;
        this.system = system;
        this.handle = maybe_1.nothing();
        this.self = function () { return _this.system.identify(_this); };
    }
    Process.prototype.init = function (c) {
        c.flags.immutable = true;
        c.flags.buffered = false;
        return c;
    };
    Process.prototype.accept = function (e) {
        this
            .handle
            .map(function (p) { return p.send(new tell_1.Tell(e.to, e.from, e.message)); })
            .orJust(function () { return new drop_1.Drop(e.to, e.from, e.message); });
        return this;
    };
    Process.prototype.stop = function () {
        this.handle =
            this
                .handle
                .map(function (p) { return p.kill(); })
                .chain(function () { return maybe_1.nothing(); });
    };
    Process.prototype.run = function () {
        this.handle =
            maybe_1.just(spawn(this))
                .map(handleErrors(this))
                .map(handleMessages(this))
                .map(handleExit(this));
        this.system.exec(new route_1.Route(this.self(), this.self()));
    };
    return Process;
}());
exports.Process = Process;
var spawn = function (p) { return child_process_1.fork(path_1.resolve(exports.SCRIPT_PATH), [], {
    env: {
        POTOO_ACTOR_ID: address_1.getId(p.self()),
        POTOO_ACTOR_ADDRESS: p.self(),
        POTOO_ACTOR_MODULE: p.module
    }
}); };
var handleMessages = function (p) { return function (c) {
    return c.on('message', function (m) { return match_1.match(m)
        .caseOf(tellShape, handleTellMessage(p))
        .caseOf(raiseShape, handleRaiseMessage(p))
        .orElse(function (m) { return p.system.exec(new drop_1.Drop(p.self(), p.self(), m)); })
        .end(); });
}; };
var handleTellMessage = function (p) { return function (_a) {
    var to = _a.to, from = _a.from, message = _a.message;
    return p.system.exec(new tell_1.Tell(to, from, message));
}; };
var handleRaiseMessage = function (p) { return function (_a) {
    var message = _a.error.message, src = _a.src, dest = _a.dest;
    return p.system.exec(new raise_1.Raise(new Error(message), src, dest));
}; };
var handleErrors = function (p) { return function (c) {
    return c.on('error', raise(p));
}; };
var raise = function (p) { return function (e) {
    return p.system.exec(new raise_1.Raise(e, p.self(), p.self()));
}; };
var handleExit = function (p) { return function (c) {
    return c.on('exit', function () { return p.system.exec(new kill_1.Kill(p.self(), p)); });
}; };
//# sourceMappingURL=index.js.map