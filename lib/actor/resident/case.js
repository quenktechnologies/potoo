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
    function Case(pattern) {
        this.pattern = pattern;
    }
    /**
     * match a message against a pattern.
     *
     * A successful match results in a side effect.
     */
    Case.prototype.match = function (m) {
        if (type_1.test(m, this.pattern)) {
            this.apply(m);
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
 * CaseClass allows for the selective matching of patterns
 * for processing messages
 */
var CaseClass = /** @class */ (function (_super) {
    __extends(CaseClass, _super);
    function CaseClass(pattern, handler) {
        var _this = _super.call(this, pattern) || this;
        _this.pattern = pattern;
        _this.handler = handler;
        return _this;
    }
    CaseClass.prototype.apply = function (m) {
        return this.handler(m);
    };
    return CaseClass;
}(Case));
exports.CaseClass = CaseClass;
//# sourceMappingURL=case.js.map