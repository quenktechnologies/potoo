"use strict";
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
var mock_1 = require("@quenk/test/lib/mock");
var _1 = require("./");
/**
 * TestAbstractSystem
 *
 * This system is provided for testing purposes. It provdies all the features
 * of the AbstractSystem.
 */
var TestAbstractSystem = /** @class */ (function (_super) {
    __extends(TestAbstractSystem, _super);
    function TestAbstractSystem(configuration) {
        if (configuration === void 0) { configuration = {}; }
        var _this = _super.call(this) || this;
        _this.configuration = configuration;
        _this.MOCK = new mock_1.Data();
        return _this;
    }
    TestAbstractSystem.prototype.exec = function (code) {
        this.MOCK.record('exec', [code], this);
        _super.prototype.exec.call(this, code);
        return this;
    };
    TestAbstractSystem.prototype.identify = function (actor) {
        return this.MOCK.record('identify', [actor], _super.prototype.identify.call(this, actor));
    };
    TestAbstractSystem.prototype.init = function (c) {
        return this.MOCK.record('init', [c], _super.prototype.init.call(this, c));
    };
    TestAbstractSystem.prototype.accept = function (e) {
        this.MOCK.record('accept', [e], this);
        _super.prototype.accept.call(this, e);
        return this;
    };
    TestAbstractSystem.prototype.stop = function () {
        return this.MOCK.record('stop', [], _super.prototype.stop.call(this));
    };
    TestAbstractSystem.prototype.run = function () {
        return this.MOCK.record('run', [], _super.prototype.run.call(this));
    };
    return TestAbstractSystem;
}(_1.AbstractSystem));
exports.TestAbstractSystem = TestAbstractSystem;
//# sourceMappingURL=test.js.map