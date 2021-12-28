"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newContext = void 0;
/**
 * newContext
 */
exports.newContext = function (aid, actor, address, template) { return ({
    aid: aid,
    mailbox: [],
    actor: actor,
    receivers: [],
    flags: 0,
    address: address,
    template: template
}); };
//# sourceMappingURL=context.js.map