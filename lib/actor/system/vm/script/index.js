"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS_INDEX_NUMBER = 0;
exports.CONSTANTS_INDEX_STRING = 1;
exports.INFO_TYPE_FUNCTION = 'f';
exports.INFO_TYPE_GLOBAL = 'g';
/**
 * PScript provides a constructor for creating Scripts.
 */
var PScript = /** @class */ (function () {
    function PScript(name, constants, info, code, immediate) {
        if (constants === void 0) { constants = [[], []]; }
        if (info === void 0) { info = []; }
        if (code === void 0) { code = []; }
        if (immediate === void 0) { immediate = false; }
        this.name = name;
        this.constants = constants;
        this.info = info;
        this.code = code;
        this.immediate = immediate;
    }
    return PScript;
}());
exports.PScript = PScript;
//# sourceMappingURL=index.js.map