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
var config = require("../../configuration");
var record_1 = require("@quenk/noni/lib/data/record");
var framework_1 = require("../../framework");
/**
 * ActorSystem default implementation for general purpose work.
 */
var ActorSystem = /** @class */ (function (_super) {
    __extends(ActorSystem, _super);
    function ActorSystem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = framework_1.newState(_this);
        return _this;
    }
    ActorSystem.prototype.allocate = function (a, h, t) {
        return framework_1.newContext(a, h, t);
    };
    return ActorSystem;
}(framework_1.AbstractSystem));
exports.ActorSystem = ActorSystem;
/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
exports.system = function (conf) {
    return new ActorSystem(record_1.rmerge(config.defaults(), conf));
};
//# sourceMappingURL=index.js.map