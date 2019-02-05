"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Script is a "program" an actor submits to the Runtime run execute.
 *
 * It consists of the following sections:
 * 1. constants - Static values referenced in the code section.
 * 2. code - A list of one or more Op codes to execute in sequence.
 */
var Script = /** @class */ (function () {
    function Script(constants, code) {
        if (constants === void 0) { constants = [[], [], [], [], [], []]; }
        if (code === void 0) { code = []; }
        this.constants = constants;
        this.code = code;
    }
    return Script;
}());
exports.Script = Script;
//# sourceMappingURL=script.js.map