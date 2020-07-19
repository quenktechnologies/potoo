"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = exports.SCRIPT_PATH = void 0;
var path_1 = require("path");
var child_process_1 = require("child_process");
var match_1 = require("@quenk/noni/lib/control/match");
var type_1 = require("@quenk/noni/lib/data/type");
var op_1 = require("../system/vm/runtime/op");
var address_1 = require("../address");
var flags_1 = require("../flags");
var address_2 = require("../address");
var scripts_1 = require("../resident/scripts");
exports.SCRIPT_PATH = __dirname + "/../../../lib/actor/process/script.js";
var raiseShape = {
    code: op_1.RAISE,
    src: String,
    dest: String,
    error: type_1.Any
};
var tellShape = {
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
var Process = /** @class */ (function () {
    function Process(module, system, script) {
        if (script === void 0) { script = exports.SCRIPT_PATH; }
        this.module = module;
        this.system = system;
        this.script = script;
        this.process = nullHandle;
        this.self = function () { return address_2.ADDRESS_DISCARD; };
    }
    Process.prototype.init = function (c) {
        c.flags = c.flags | flags_1.FLAG_IMMUTABLE | flags_1.FLAG_ROUTER;
        return c;
    };
    Process.prototype.accept = function (e) {
        this.process.send(e);
        return this;
    };
    Process.prototype.notify = function () {
    };
    Process.prototype.stop = function () {
        this.process.kill();
    };
    Process.prototype.start = function (addr) {
        var _this = this;
        this.self = function () { return addr; };
        var p = child_process_1.fork(path_1.resolve(this.script), [], spawnOpts(this));
        p.on('error', function (e) { return _this.system.exec(_this, new scripts_1.Raise(e.message)); });
        //TODO: What should we do with invalid messages?
        p.on('message', function (m) {
            return match_1.match(m)
                .caseOf(tellShape, handleTell(_this))
                .caseOf(raiseShape, handleRaise(_this))
                .orElse(function () { })
                .end();
        });
        p.on('exit', function () {
            _this.process = nullHandle;
            _this.system.exec(_this, new scripts_1.Kill(_this.self()));
        });
        this.process = p;
    };
    return Process;
}());
exports.Process = Process;
var nullHandle = {
    send: function () {
    },
    kill: function () {
    }
};
var spawnOpts = function (p) { return ({
    env: {
        POTOO_ACTOR_ID: address_1.getId(p.self()),
        POTOO_ACTOR_ADDRESS: p.self(),
        POTOO_ACTOR_MODULE: p.module,
        POTOO_PVM_CONF: process.env.POTOO_PVM_CONF
    }
}); };
var handleTell = function (p) { return function (m) {
    return p.system.exec(p, new scripts_1.Tell(m.to, m.message));
}; };
var handleRaise = function (p) { return function (_a) {
    var error = _a.error, src = _a.src;
    return p.system.exec(p, new scripts_1.Raise("[" + src + "]: " + error));
}; };
//# sourceMappingURL=index.js.map