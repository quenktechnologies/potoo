"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutable = void 0;
const flags_1 = require("../../flags");
const __1 = require("../");
const function_1 = require("../case/function");
/**
 * Mutable actors can change their behaviour after message processing.
 */
class Mutable extends __1.AbstractResident {
    constructor() {
        super(...arguments);
        this.$receivers = [];
    }
    init(c) {
        c.flags = c.flags | flags_1.FLAG_BUFFERED;
        return c;
    }
    /**
     * select the next message in the mailbox using the provided case classes.
     *
     * If the message cannot be handled by any of them, it will be dropped.
     */
    select(cases) {
        this.$receivers.push(new function_1.CaseFunction(cases));
        this.notify();
        return this;
    }
}
exports.Mutable = Mutable;
//# sourceMappingURL=index.js.map