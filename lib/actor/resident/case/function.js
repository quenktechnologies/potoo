"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseFunction = void 0;
/**
 * CaseFunction is a composite object for Case classes.
 *
 * It combines mutliple Case classes into one serving effectively as a pattern
 * matching function.
 */
var CaseFunction = /** @class */ (function () {
    function CaseFunction(cases) {
        this.cases = cases;
    }
    /**
     * test whether at least one of the underlying Case classes will handle the
     * Message.
     */
    CaseFunction.prototype.test = function (msg) {
        return this.cases.some(function (kase) { return kase.test(msg); });
    };
    /**
     * apply the first Case class that will handle the provided Message.
     *
     * Throws if none of them will.
     */
    CaseFunction.prototype.apply = function (msg) {
        var kase = this.cases.find(function (kase) { return kase.test(msg); });
        if (!kase)
            throw new Error("CaseFunction: No Case patterns match!");
        return kase.apply(msg);
    };
    return CaseFunction;
}());
exports.CaseFunction = CaseFunction;
//# sourceMappingURL=function.js.map