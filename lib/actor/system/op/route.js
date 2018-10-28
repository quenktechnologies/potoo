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
var log = require("../log");
var _1 = require("./");
/**
 * Route instruction.
 */
var Route = /** @class */ (function (_super) {
    __extends(Route, _super);
    function Route(from, to) {
        var _this = _super.call(this) || this;
        _this.from = from;
        _this.to = to;
        _this.code = _1.OP_ROUTE;
        _this.level = log.INFO;
        return _this;
    }
    Route.prototype.exec = function (s) {
        return exports.execRoute(s, this);
    };
    return Route;
}(_1.Op));
exports.Route = Route;
/**
 * execRoute
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
exports.execRoute = function (s, _a) {
    var from = _a.from, to = _a.to;
    s
        .state
        .putRoute(from, to);
};
//# sourceMappingURL=route.js.map