"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * Void system.
 *
 * This can be used to prevent a stopped actor from executing further commands.
 */
var Void = /** @class */ (function () {
    function Void() {
    }
    Void.prototype.ident = function () {
        return '?';
    };
    Void.prototype.accept = function () {
    };
    Void.prototype.run = function () {
    };
    Void.prototype.notify = function () {
    };
    Void.prototype.stop = function () {
    };
    Void.prototype.exec = function (_, __) {
        return maybe_1.nothing();
    };
    return Void;
}());
exports.Void = Void;
//# sourceMappingURL=index.js.map