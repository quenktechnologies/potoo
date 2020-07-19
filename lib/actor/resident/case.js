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
exports.Default = exports.Case = void 0;
var type_1 = require("@quenk/noni/lib/data/type");
/**
 * Case is provided for situations where it is better to extend
 * the Case class instead of creating new instances.
 */
var Case = /** @class */ (function () {
    function Case(pattern, handler) {
        this.pattern = pattern;
        this.handler = handler;
    }
    /**
     * test whether the supplied message satisfies the Case test.
     */
    Case.prototype.test = function (m) {
        return type_1.test(m, this.pattern);
    };
    /**
     * apply the handler to the message.
     */
    Case.prototype.apply = function (m) {
        return this.handler(m);
    };
    return Case;
}());
exports.Case = Case;
/**
 * Default matches any message value.
 */
var Default = /** @class */ (function (_super) {
    __extends(Default, _super);
    function Default(handler) {
        var _this = _super.call(this, Object, handler) || this;
        _this.handler = handler;
        return _this;
    }
    Default.prototype.test = function (_) {
        return true;
    };
    Default.prototype.apply = function (m) {
        return this.handler(m);
    };
    return Default;
}(Case));
exports.Default = Default;
//# sourceMappingURL=case.js.map