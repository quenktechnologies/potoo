"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("../monad/Either");
/**
 * CoProduct
 */
var CoProduct = (function () {
    function CoProduct(e) {
        this.e = e;
    }
    CoProduct.prototype.map = function (f) {
        return new CoProduct(this.cata(function (l) { return new Either_1.Left(l.map(f)); }, function (r) { return new Either_1.Right(r.map(f)); }));
    };
    CoProduct.prototype.cata = function (f, g) {
        return this.e.cata(f, g);
    };
    return CoProduct;
}());
exports.CoProduct = CoProduct;
/**
 * left
 */
exports.left = function (f) {
    return new CoProduct(new Either_1.Left(f));
};
/**
 * right
 */
exports.right = function (f) {
    return new CoProduct(new Either_1.Right(f));
};
//# sourceMappingURL=CoProduct.js.map