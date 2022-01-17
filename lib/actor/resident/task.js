"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const flags_1 = require("../flags");
const _1 = require("./");
/**
 * Task executes its run method then exits.
 *
 * Use this actor to communicate with the system when not interested in
 * receiving messages.
 */
class Task extends _1.AbstractResident {
    init(c) {
        c.flags = c.flags | flags_1.FLAG_EXIT_AFTER_RUN;
        return c;
    }
}
exports.Task = Task;
//# sourceMappingURL=task.js.map