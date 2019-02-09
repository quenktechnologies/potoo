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
var base = require("../../../../resident");
/**
 * Immutable actor for use with the default system.
 */
var Immutable = /** @class */ (function (_super) {
    __extends(Immutable, _super);
    function Immutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Immutable;
}(base.Immutable));
exports.Immutable = Immutable;
/**
 * Mutable actor for use with the default system.
 */
var Mutable = /** @class */ (function (_super) {
    __extends(Mutable, _super);
    function Mutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Mutable;
}(base.Mutable));
exports.Mutable = Mutable;
//# sourceMappingURL=resident.js.map