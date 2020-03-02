"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PVM_TYPE_INDEX_FLOAT64 = 0;
exports.PVM_TYPE_INDEX_STRING = 1;
exports.PVM_TYPE_INDEX_ADDRESS = 1;
exports.PVM_TYPE_INDEX_TEMPLATE = 2;
exports.PVM_TYPE_INDEX_MESSAGE = 3;
/**
 * Script contains the code and supporting information of an actor used by
 * the VM for code execution.
 *
 * @param constants - The constant pool for the actor where certain references
 *                    are resolved from.
 *
 * @param code      - The actual instructions the VM will execute.
 */
var Script = /** @class */ (function () {
    function Script(constants, code) {
        if (constants === void 0) { constants = [[], [], [], [],]; }
        if (code === void 0) { code = []; }
        this.constants = constants;
        this.code = code;
    }
    return Script;
}());
exports.Script = Script;
//# sourceMappingURL=script.js.map