"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address = require("../address");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var record_1 = require("@quenk/noni/lib/data/record");
var address_1 = require("../address");
var spawn_1 = require("./op/spawn");
var drop_1 = require("./op/drop");
var op_1 = require("./op");
var frame_1 = require("./state/frame");
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
        this.stack = stack;
        this.configuration = configuration;
        this.state = new state_1.State({ $: nullFrame(this) }, {});
        this.running = false;
    }
    ActorSystem.prototype.init = function () {
        return [undefined, { immutable: true, buffered: false }];
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
        var a = t.create(this);
        var i = a.init();
        var flags = flagDefaults(i[1] || {});
        var stack = i[0] ? [i[0]] : [];
        return new frame_1.ActorFrame(flags.buffered ? maybe_1.just([]) : maybe_1.nothing(), a, stack, flags, t);
    };
    ActorSystem.prototype.spawn = function (t) {
        this.exec(new spawn_1.Spawn(this, t));
        return this;
    };
    ActorSystem.prototype.identify = function (actor) {
        return this
            .state
            .getAddress(actor)
            .orJust(function () { return address_1.ADDRESS_DISCARD; })
            .get();
    };
    ActorSystem.prototype.run = function () {
        var _a = this.configuration.log, level = _a.level, logger = _a.logger;
        if (this.running)
            return;
        this.running = true;
        while (this.stack.length > 0)
            op_1.log(level || 0, logger || console, this.stack.pop()).exec(this);
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
        this.state = new state_1.State({ $: nullFrame(this) }, {});
        this.configuration = {};
    }
    NullSystem.prototype.init = function () {
        return [undefined, undefined];
    };
    NullSystem.prototype.accept = function (_a) {
        var to = _a.to, from = _a.from, message = _a.message;
        return this.exec(new drop_1.Drop(to, from, message));
    };
    NullSystem.prototype.stop = function () {
        throw new Error('The system has been stopped!');
    };
    NullSystem.prototype.allocate = function (t) {
        return new frame_1.ActorFrame(maybe_1.nothing(), this, [], flagDefaults({}), t);
    };
    NullSystem.prototype.spawn = function (_) {
        return this;
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
var flagDefaults = function (f) {
    return record_1.merge({ buffered: true, immutable: true }, f);
};
var nullFrame = function (s) {
    return new frame_1.ActorFrame(maybe_1.nothing(), s, [], flagDefaults({}), new SysT());
};
//# sourceMappingURL=index.js.map