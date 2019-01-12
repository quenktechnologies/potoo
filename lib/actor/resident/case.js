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
     * match a message against a pattern.
     *
     * A successful match results in a side effect.
     */
    Case.prototype.match = function (m) {
        if (type_1.test(m, this.pattern)) {
            this.handler(m);
            return true;
        }
        else {
            return false;
        }
    };
    return Case;
}());
exports.Case = Case;
/**
 * ClassCase allows for the selective matching of patterns
 * for processing messages
 */
var ClassCase = /** @class */ (function (_super) {
    __extends(ClassCase, _super);
    function ClassCase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClassCase;
}(Case));
exports.ClassCase = ClassCase;
/**
 * DefaultCase matches any message value.
 */
var DefaultCase = /** @class */ (function (_super) {
    __extends(DefaultCase, _super);
    function DefaultCase(handler) {
        var _this = _super.call(this, Object, handler) || this;
        _this.handler = handler;
        return _this;
    }
    DefaultCase.prototype.match = function (m) {
        this.handler(m);
        return true;
    };
    return DefaultCase;
}(Case));
exports.DefaultCase = DefaultCase;
//# sourceMappingURL=case.js.map