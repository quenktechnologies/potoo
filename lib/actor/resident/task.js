"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
var flags_1 = require("../flags");
var _1 = require("./");
/**
 * Task executes its run method then exits.
 *
 * Use this actor to communicate with the system when not interested in
 * receiving messages.
 */
var Task = /** @class */ (function (_super) {
    __extends(Task, _super);
    function Task() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Task.prototype.init = function (c) {
        c.flags = c.flags | flags_1.FLAG_EXIT_AFTER_RUN;
        return c;
    };
    return Task;
}(_1.AbstractResident));
exports.Task = Task;
//# sourceMappingURL=task.js.map