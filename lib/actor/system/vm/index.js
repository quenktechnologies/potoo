"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * PVM is the Potoo Virtual Machine.
 */
var PVM = /** @class */ (function () {
    function PVM(system, config) {
        this.system = system;
        this.config = config;
        /**
         * state contains information about all the actors in the system, routers
         * and groups.
         */
        this.state = {
            contexts: {},
            routers: {},
            groups: {}
        };
        /**
         * pending scripts to execute.
         */
        this.pending = [];
    }
    PVM.prototype.exec = function (_actor, _s) {
    };
    return PVM;
}());
exports.PVM = PVM;
//# sourceMappingURL=index.js.map