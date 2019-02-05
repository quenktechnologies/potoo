"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Query verifies whether an address has a valid Context within the system.
 *
 * Pops:
 * 1. Address to query
 *
 * Pushes:
 * 1 on true, 0 otherwise.
 */
var Query = /** @class */ (function () {
    function Query() {
        this.code = _1.OP_CODE_QUERY;
        this.level = _1.Level.Control;
    }
    Query.prototype.exec = function (e) {
        var curr = e.current().get();
        var eitherAddr = curr.resolveAddress(curr.pop());
        if (eitherAddr.isLeft())
            return e.raise(eitherAddr.takeLeft());
        var addr = eitherAddr.takeRight();
        var maybe = e
            .getRouter(addr)
            .orElse(function () { return e.getContext(addr); });
        if (maybe.isJust())
            curr.pushNumber(1);
        else
            curr.pushNumber(0);
    };
    Query.prototype.toLog = function (f) {
        return ['query', [], f.peek()];
    };
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.js.map