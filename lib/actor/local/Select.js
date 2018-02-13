"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Select is for selective receives.
 */
var Select = /** @class */ (function () {
    function Select(cases, system) {
        this.cases = cases;
        this.system = system;
    }
    Select.prototype.consume = function (m) {
        if (this.cases.some(function (c) { return c.match(m.value); })) {
            this.system.log().messageReceived(m);
            return null;
        }
        else {
            this.system.log().messageDropped(m);
            return this;
        }
    };
    return Select;
}());
exports.Select = Select;
//# sourceMappingURL=Select.js.map