"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * newContext creates a new Context with default values.
 */
exports.newContext = function (actor, template) { return ({
    mailbox: maybe_1.nothing(),
    actor: actor,
    behaviour: [],
    flags: { immutable: false, buffered: false },
    template: template
}); };
//# sourceMappingURL=index.js.map