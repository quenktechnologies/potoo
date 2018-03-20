"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("afpl/lib/monad/Maybe");
/**
 * Select is for selective receives.
 */
var Select = /** @class */ (function () {
    function Select(cases, system) {
        this.cases = cases;
        this.system = system;
    }
    Select.prototype.apply = function (m) {
        if (this.cases.some(function (c) { return c.match(m.message); })) {
            this.system.log().messageReceived(m);
            return Maybe_1.nothing();
        }
        else {
            this.system.log().messageDropped(m);
            return Maybe_1.just(this);
        }
    };
    Select.prototype.merge = function (cases) {
        return new Select(this.cases.concat(cases), this.system);
    };
    return Select;
}());
exports.Select = Select;
//# sourceMappingURL=Select.js.map