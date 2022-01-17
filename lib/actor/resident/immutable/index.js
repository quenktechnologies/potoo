"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Immutable = void 0;
const flags_1 = require("../../flags");
const function_1 = require("../case/function");
const __1 = require("../");
/**
 * Immutable actors do not change their receiver behaviour after receiving
 * a message. The same receiver is applied to each and every message.
 */
class Immutable extends __1.AbstractResident {
    get $receiver() {
        return new function_1.CaseFunction(this.receive());
    }
    init(c) {
        c.flags = c.flags | flags_1.FLAG_IMMUTABLE | flags_1.FLAG_BUFFERED;
        return c;
    }
    /**
     * receive provides the list of Case classes that the actor will be used
     * to process incomming messages.
     */
    receive() {
        return [];
    }
}
exports.Immutable = Immutable;
//# sourceMappingURL=index.js.map