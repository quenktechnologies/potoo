"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kindof_1 = require("@quenk/kindof");
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
var Case = /** @class */ (function () {
    function Case(type, handler) {
        this.type = type;
        this.handler = handler;
    }
    Case.prototype._execute = function (m) {
        var _this = this;
        setTimeout(function () { return _this.handler(m); }, 0);
    };
    /**
     * match checks if the supplied type satisfies this Case
     */
    Case.prototype.match = function (m) {
        var r = kindof_1.kindOf(m, this.type);
        if (r)
            this._execute(m);
        return r;
    };
    return Case;
}());
exports.Case = Case;
//# sourceMappingURL=Case.js.map