"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * newContext
 */
exports.newContext = function (runtime, actor, template) { return ({
    mailbox: maybe_1.nothing(),
    actor: actor,
    behaviour: [],
    flags: { immutable: false, buffered: false },
    runtime: runtime,
    template: template
}); };
//# sourceMappingURL=context.js.map