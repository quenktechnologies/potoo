"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
var Case = (function () {
    function Case(t, h) {
        this.t = t;
        this.h = h;
    }
    /**
     * matches checks if the supplied type satisfies this Case
     */
    Case.prototype.matches = function (m) {
        switch (typeof this.t) {
            case 'function':
                return m instanceof this.t;
                break;
            default:
                return this.t === m;
        }
    };
    /**
     * apply the function of this Case to a message
     */
    Case.prototype.apply = function (m) {
        this.h(m);
    };
    return Case;
}());
exports.Case = Case;
//# sourceMappingURL=Case.js.map