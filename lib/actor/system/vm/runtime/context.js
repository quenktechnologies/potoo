"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * newContext
 */
exports.newContext = function (actor, address, template) { return ({
    mailbox: [],
    actor: actor,
    receivers: [],
    flags: 0,
    address: address,
    template: template
}); };
//# sourceMappingURL=context.js.map