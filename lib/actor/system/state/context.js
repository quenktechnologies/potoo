"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * ActorContext is a Context instance.
 */
var ActorContext = /** @class */ (function () {
    function ActorContext(mailbox, actor, behaviour, flags, template) {
        this.mailbox = mailbox;
        this.actor = actor;
        this.behaviour = behaviour;
        this.flags = flags;
        this.template = template;
    }
    /**
     * create constructs a new Context with default values.
     */
    ActorContext.create = function (actor, template) {
        return new ActorContext(maybe_1.just([]), actor, [], { immutable: false, buffered: true }, template);
    };
    return ActorContext;
}());
exports.ActorContext = ActorContext;
//# sourceMappingURL=context.js.map