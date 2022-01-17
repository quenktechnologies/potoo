"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newContext = void 0;
/**
 * newContext
 */
const newContext = (aid, actor, address, template) => ({
    aid,
    mailbox: [],
    actor,
    receivers: [],
    flags: 0,
    address,
    template: template
});
exports.newContext = newContext;
//# sourceMappingURL=context.js.map