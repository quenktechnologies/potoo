"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var address_1 = require("../../address");
var scripts_1 = require("./scripts");
var this_1 = require("../vm/runtime/this");
/**
 * STemplate is provided here as a convenience when creating new systems.
 *
 * It provides the expected defaults.
 */
var STemplate = /** @class */ (function () {
    function STemplate() {
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
    return STemplate;
}());
exports.STemplate = STemplate;
/**
 * AbstractSystem
 *
 * Implemnation of a System and Runtime that spawns
 * various general purpose actors.
 */
var AbstractSystem = /** @class */ (function () {
    function AbstractSystem(configuration) {
        if (configuration === void 0) { configuration = {}; }
        this.configuration = configuration;
    }
    /**
     * spawn a new actor from a template.
     */
    AbstractSystem.prototype.spawn = function (t) {
        (new this_1.This('$', this)).exec(new scripts_1.SpawnScript('', t));
        return this;
    };
    AbstractSystem.prototype.init = function (c) {
        return c;
    };
    AbstractSystem.prototype.notify = function () { };
    AbstractSystem.prototype.accept = function () {
        return this;
    };
    AbstractSystem.prototype.stop = function () { };
    AbstractSystem.prototype.run = function () { };
    return AbstractSystem;
}());
exports.AbstractSystem = AbstractSystem;
/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
exports.newContext = function (actor, handler, template) { return ({
    mailbox: maybe_1.nothing(),
    actor: actor,
    behaviour: [],
    flags: { immutable: false, buffered: false },
    handler: handler,
    template: template
}); };
/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
exports.newState = function (sys) { return ({
    contexts: {
        $: exports.newContext(sys, new this_1.This('$', sys), new STemplate())
    },
    routers: {}
}); };
//# sourceMappingURL=index.js.map