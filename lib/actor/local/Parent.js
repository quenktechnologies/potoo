"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
/**
 * Parent actor only spanws child actors.
 */
var Parent = /** @class */ (function (_super) {
    __extends(Parent, _super);
    function Parent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Parent.prototype.accept = function (e) {
        this.system.discard(e);
        return this;
    };
    Parent.prototype.run = function () {
        return this;
    };
    return Parent;
}(_1.Local));
exports.Parent = Parent;
//# sourceMappingURL=Parent.js.map