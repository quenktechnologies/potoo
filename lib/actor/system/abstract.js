"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address_1 = require("../address");
var discard_1 = require("./op/discard");
var op_1 = require("./op");
var state_1 = require("./state");
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
//# sourceMappingURL=abstract.js.map