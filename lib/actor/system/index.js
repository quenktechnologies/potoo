"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address = require("../address");
var address_1 = require("../address");
var spawn_1 = require("./op/spawn");
var drop_1 = require("./op/drop");
var op_1 = require("./op");
var context_1 = require("../context");
var state_1 = require("./state");
/**
 * @private
 */
var SysT = /** @class */ (function () {
    function SysT() {
        this.id = address.ADDRESS_SYSTEM;
        this.create = function () { throw new Error('Illegal attempt to restart system!'); };
        this.trap = function (e) {
            if (e instanceof Error) {
                throw e;
            }
            else {
                throw new Error(e.message);
            }
        };
    }
    return SysT;
}());
/**
 * ActorSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
var ActorSystem = /** @class */ (function () {
    function ActorSystem(stack, configuration) {
        if (configuration === void 0) { configuration = {}; }
        this.stack = stack;
        this.configuration = configuration;
        this.state = {
            contexts: {
                $: context_1.newContext(this, new SysT())
            },
            routes: {}
        };
        this.running = false;
    }
    ActorSystem.prototype.init = function (c) {
        return c;
    };
    ActorSystem.prototype.exec = function (code) {
        this.stack.push(code);
        this.run();
        return this;
    };
    ActorSystem.prototype.accept = function (_a) {
        var to = _a.to, from = _a.from, message = _a.message;
        return this.exec(new drop_1.Drop(to, from, message));
    };
    ActorSystem.prototype.stop = function () {
        throw new Error('The system has been stopped!');
    };
    ActorSystem.prototype.allocate = function (t) {
        var act = t.create(this);
        return act.init(context_1.newContext(act, t));
    };
    ActorSystem.prototype.spawn = function (t) {
        this.exec(new spawn_1.Spawn(this, t));
        return this;
    };
    ActorSystem.prototype.identify = function (actor) {
        return state_1.getAddress(this.state, actor)
            .orJust(function () { return address_1.ADDRESS_DISCARD; })
            .get();
    };
    ActorSystem.prototype.run = function () {
        var policy = (this.configuration.log || {});
        if (this.running)
            return;
        this.running = true;
        while (this.stack.length > 0)
            op_1.log(policy.level || 0, policy.logger || console, this.stack.pop()).exec(this);
        this.running = false;
    };
    return ActorSystem;
}());
exports.ActorSystem = ActorSystem;
/**
 * NullSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
var NullSystem = /** @class */ (function () {
    function NullSystem() {
    }
    NullSystem.prototype.init = function (c) {
        return c;
    };
    NullSystem.prototype.accept = function (_) {
        return this;
    };
    NullSystem.prototype.stop = function () {
        throw new Error('The system has been stopped!');
    };
    NullSystem.prototype.identify = function (_) {
        return address_1.ADDRESS_DISCARD;
    };
    NullSystem.prototype.exec = function (_) {
        return this;
    };
    NullSystem.prototype.run = function () { };
    return NullSystem;
}());
exports.NullSystem = NullSystem;
//# sourceMappingURL=index.js.map