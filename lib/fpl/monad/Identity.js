"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Identity
 */
var Identity = (function () {
    function Identity(a) {
        this.a = a;
    }
    /**
     * of
     */
    Identity.prototype.of = function (a) {
        return new Identity(a);
    };
    /**
     * map
     */
    Identity.prototype.map = function (f) {
        return new Identity(f(this.get()));
    };
    /**
     * chain
     */
    Identity.prototype.chain = function (f) {
        return f(this.get());
    };
    /**
     * ap
     */
    Identity.prototype.ap = function (i) {
        var _this = this;
        return i.map(function (f) { return f(_this.get()); });
    };
    /**
     * get the value of an Identity
     * @summary get :: Identity<A> →  A
     */
    Identity.prototype.get = function () {
        return this.a;
    };
    return Identity;
}());
exports.Identity = Identity;
//# sourceMappingURL=Identity.js.map