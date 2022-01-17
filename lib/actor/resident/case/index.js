"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = exports.caseOf = exports.Case = void 0;
const type_1 = require("@quenk/noni/lib/data/type");
/**
 * Case is provided for situations where it is better to extend
 * the Case class instead of creating new instances.
 */
class Case {
    constructor(pattern, handler) {
        this.pattern = pattern;
        this.handler = handler;
    }
    /**
     * test whether the supplied message satisfies the Case test.
     */
    test(m) {
        return (0, type_1.test)(m, this.pattern);
    }
    /**
     * apply the handler to the message.
     */
    apply(m) {
        return this.handler(m);
    }
}
exports.Case = Case;
function caseOf(pattern, handler) {
    return new Case(pattern, handler);
}
exports.caseOf = caseOf;
/**
 * Default matches any message value.
 */
class Default extends Case {
    constructor(handler) {
        super(Object, handler);
        this.handler = handler;
    }
    test(_) {
        return true;
    }
    apply(m) {
        return this.handler(m);
    }
}
exports.Default = Default;
//# sourceMappingURL=index.js.map