"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var maybe_1 = require("@quenk/noni/lib/data/maybe");
/**
 * ActorFrame is a Frame instance.
 */
var ActorFrame = /** @class */ (function () {
    function ActorFrame(mailbox, actor, behaviour, flags, template) {
        this.mailbox = mailbox;
        this.actor = actor;
        this.behaviour = behaviour;
        this.flags = flags;
        this.template = template;
    }
    /**
     * newFrame constructs a new Frame with default values.
     */
    ActorFrame.create = function (actor, template) {
        return new ActorFrame(maybe_1.just([]), actor, [], { immutable: false, buffered: true }, template);
    };
    return ActorFrame;
}());
exports.ActorFrame = ActorFrame;
//# sourceMappingURL=frame.js.map