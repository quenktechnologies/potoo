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
exports.Immutable = void 0;
var flags_1 = require("../../flags");
var function_1 = require("../case/function");
var __1 = require("../");
/**
 * Immutable actors do not change their receiver behaviour after receiving
 * a message. The same receiver is applied to each and every message.
 */
var Immutable = /** @class */ (function (_super) {
    __extends(Immutable, _super);
    function Immutable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Immutable.prototype, "$receiver", {
        get: function () {
            return new function_1.CaseFunction(this.receive());
        },
        enumerable: false,
        configurable: true
    });
    Immutable.prototype.init = function (c) {
        c.flags = c.flags | flags_1.FLAG_IMMUTABLE | flags_1.FLAG_BUFFERED;
        return c;
    };
    /**
     * receive provides the list of Case classes that the actor will be used
     * to process incomming messages.
     */
    Immutable.prototype.receive = function () {
        return [];
    };
    return Immutable;
}(__1.AbstractResident));
exports.Immutable = Immutable;
//# sourceMappingURL=index.js.map