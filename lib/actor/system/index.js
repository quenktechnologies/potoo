"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address = require("../address");
var log = require("./log");
var spawn_1 = require("./op/spawn");
var drop_1 = require("./op/drop");
var state_1 = require("./state");
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
 * @private
 */
var ActorSystem = /** @class */ (function () {
    function ActorSystem(stack, configuration) {
        this.stack = stack;
        this.configuration = configuration;
        this.actors = new state_1.State({ $: nullFrame(this) }, {});
        this.running = false;
    }
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
    /**
     * logOp
     *
     * @private
     */
    ActorSystem.prototype.logOp = function (o) {
        var _a = this.configuration.log, level = _a.level, logger = _a.logger;
        if (o.level <= level)
            switch (o.level) {
                case log.INFO:
                    logger.info(o);
                    break;
                case log.WARN:
                    logger.warn(o);
                    break;
                case log.ERROR:
                    logger.error(o);
                    break;
                default:
                    logger.log(o);
                    break;
            }
        return o;
    };
    ActorSystem.prototype.spawn = function (t) {
        this.exec(new spawn_1.Spawn(this, t));
        return this;
    };
    ActorSystem.prototype.run = function () {
        if (this.running)
            return;
        this.running = true;
        while (this.stack.length > 0)
            this.logOp(this.stack.pop()).exec(this);
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
        this.actors = new state_1.State({ $: nullFrame(this) }, {});
        this.configuration = {};
    }
    NullSystem.prototype.exec = function (_) {
        return this;
    };
    NullSystem.prototype.accept = function (_a) {
        var to = _a.to, from = _a.from, message = _a.message;
        return this.exec(new drop_1.Drop(to, from, message));
    };
    NullSystem.prototype.stop = function () {
        throw new Error('The system has been stopped!');
    };
    NullSystem.prototype.spawn = function (_) {
        return this;
    };
    NullSystem.prototype.run = function () {
    };
    return NullSystem;
}());
exports.NullSystem = NullSystem;
var nullFrame = function (s) { return new state_1.Frame([], s, [], {
    immutable: true,
    busy: true
}, new SysT()); };
//# sourceMappingURL=index.js.map