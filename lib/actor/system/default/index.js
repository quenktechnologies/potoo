"use strict";
/**
 * This module provides a default actor system implementation
 * along with submodules for creating resident actors.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/** imports */
var config = require("../configuration");
var address = require("../../address");
var record_1 = require("@quenk/noni/lib/data/record");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var spawn_1 = require("../op/spawn");
var discard_1 = require("../op/discard");
var abstract_1 = require("../abstract");
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
var ActorSystem = /** @class */ (function (_super) {
    __extends(ActorSystem, _super);
    function ActorSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            contexts: {
                $: newContext(_this, new SysT())
            },
            routes: {}
        };
        _this.running = false;
        return _this;
    }
    ActorSystem.prototype.accept = function (_a) {
        var to = _a.to, from = _a.from, message = _a.message;
        return this.exec(new discard_1.Discard(to, from, message));
    };
    ActorSystem.prototype.allocate = function (t) {
        var act = t.create(this);
        return act.init(newContext(act, t));
    };
    /**
     * spawn a new actor from a template.
     */
    ActorSystem.prototype.spawn = function (t) {
        this.exec(new spawn_1.Spawn(this, t));
        return this;
    };
    return ActorSystem;
}(abstract_1.AbstractSystem));
exports.ActorSystem = ActorSystem;
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
exports.system = function (conf) {
    return new ActorSystem(record_1.rmerge(config.defaults(), conf));
};
var newContext = function (actor, template) { return ({
    mailbox: maybe_1.nothing(),
    actor: actor,
    behaviour: [],
    flags: { immutable: false, buffered: false },
    template: template
}); };
//# sourceMappingURL=index.js.map