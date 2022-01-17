"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VMActorScript = exports.NoScript = exports.BaseScript = exports.commonFunctions = void 0;
const op = require("../runtime/op");
const info_1 = require("../script/info");
/**
 * commonFunctions used by both the VM script and the resident ones.
 */
exports.commonFunctions = [
    // $0: Message 1: Address
    new info_1.NewFunInfo('tell', 2, [op.SEND])
];
/**
 * BaseScript providing sane defaults for all our Script instances.
 */
class BaseScript {
    constructor() {
        this.constants = [[], []];
        this.name = '<main>';
        this.info = [];
        this.code = [];
    }
}
exports.BaseScript = BaseScript;
/**
 * NoScript is used for actors that do not execute any code.
 */
class NoScript extends BaseScript {
}
exports.NoScript = NoScript;
/**
 * VMActorScript is the script used by the VM for its own actor (the $ actor).
 *
 * This script provides VM functions for:
 * 1. Sending messages
 * 2. Retrieving messages.
 * 3. Killing other actors.
 * 4. Racing exceptions.
 */
class VMActorScript extends BaseScript {
    constructor() {
        super(...arguments);
        this.info = exports.commonFunctions;
    }
}
exports.VMActorScript = VMActorScript;
//# sourceMappingURL=index.js.map