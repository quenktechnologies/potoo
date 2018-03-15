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
 * Static actors do not change their behaviour.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
var Static = /** @class */ (function (_super) {
    __extends(Static, _super);
    function Static() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Static.prototype.run = function () { return this; };
    Static.prototype.accept = function (e) {
        var r = Array.isArray(this.receive) ? this.receive : [this.receive];
        this.__system.log().messageAccepted(e);
        if (!r.some(function (c) { return c.match(e.message); }))
            this.__system.discard(e);
        return this;
    };
    return Static;
}(_1.Local));
exports.Static = Static;
//# sourceMappingURL=Static.js.map