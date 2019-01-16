"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var address_1 = require("../../address");
var discard_1 = require("../op/discard");
var op_1 = require("../op");
var state_1 = require("../state");
var spawn_1 = require("../op/spawn");
/**
 * Template is provided here as a convenience when creating new systems.
 *
 * It provides the expected defaults.
 */
var Template = /** @class */ (function () {
    function Template() {
        this.id = address_1.ADDRESS_SYSTEM;
        this.create = function () {
            throw new Error('Cannot spawn a system actor!');
        };
        this.trap = function (e) {
            if (e instanceof Error) {
                throw e;
            }
            else {
                throw new Error(e.message);
            }
        };
    }
    return Template;
}());
exports.Template = Template;
/**
 * AbstractSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
var AbstractSystem = /** @class */ (function () {
    function AbstractSystem(configuration) {
        if (configuration === void 0) { configuration = {}; }
        this.configuration = configuration;
        this.stack = [];
        this.running = false;
    }
    AbstractSystem.prototype.exec = function (code) {
        this.stack.push(code);
        this.run();
        return this;
    };
    /**
     * spawn a new actor from a template.
     */
    AbstractSystem.prototype.spawn = function (t) {
        this.exec(new spawn_1.Spawn(this, t));
        return this;
    };
    AbstractSystem.prototype.identify = function (actor) {
        return state_1.getAddress(this.state, actor)
            .orJust(function () { return address_1.ADDRESS_DISCARD; })
            .get();
    };
    AbstractSystem.prototype.init = function (c) {
        return c;
    };
    AbstractSystem.prototype.accept = function (_a) {
        var to = _a.to, from = _a.from, message = _a.message;
        return this.exec(new discard_1.Discard(to, from, message));
    };
    AbstractSystem.prototype.stop = function () { };
    AbstractSystem.prototype.run = function () {
        var policy = (this.configuration.log || {});
        if (this.running)
            return;
        this.running = true;
        while (this.stack.length > 0)
            op_1.log(policy.level || 0, policy.logger || console, this.stack.pop()).exec(this);
        this.running = false;
    };
    return AbstractSystem;
}());
exports.AbstractSystem = AbstractSystem;
/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
exports.newContext = function (actor, template) { return ({
    mailbox: maybe_1.nothing(),
    actor: actor,
    behaviour: [],
    flags: { immutable: false, buffered: false },
    template: template
}); };
/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
exports.newState = function (sys) { return ({
    contexts: {
        $: exports.newContext(sys, new Template())
    },
    routes: {}
}); };
//# sourceMappingURL=index.js.map