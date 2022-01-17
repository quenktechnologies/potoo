"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseFunction = void 0;
/**
 * CaseFunction is a composite object for Case classes.
 *
 * It combines mutliple Case classes into one serving effectively as a pattern
 * matching function.
 */
class CaseFunction {
    constructor(cases) {
        this.cases = cases;
    }
    /**
     * test whether at least one of the underlying Case classes will handle the
     * Message.
     */
    test(msg) {
        return this.cases.some(kase => kase.test(msg));
    }
    /**
     * apply the first Case class that will handle the provided Message.
     *
     * Throws if none of them will.
     */
    apply(msg) {
        let kase = this.cases.find(kase => kase.test(msg));
        if (!kase)
            throw new Error(`CaseFunction: No Case patterns match!`);
        return kase.apply(msg);
    }
}
exports.CaseFunction = CaseFunction;
//# sourceMappingURL=function.js.map