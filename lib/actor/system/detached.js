"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address_1 = require("../address");
/**
 * DetachedSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
var DetachedSystem = /** @class */ (function () {
    function DetachedSystem() {
    }
    DetachedSystem.prototype.init = function (c) {
        return c;
    };
    DetachedSystem.prototype.accept = function (_) {
        return this;
    };
    DetachedSystem.prototype.stop = function () {
        throw new Error('The system has been stopped!');
    };
    DetachedSystem.prototype.identify = function (_) {
        return address_1.ADDRESS_DISCARD;
    };
    DetachedSystem.prototype.exec = function (_) {
        return this;
    };
    DetachedSystem.prototype.run = function () { };
    return DetachedSystem;
}());
exports.DetachedSystem = DetachedSystem;
//# sourceMappingURL=detached.js.map