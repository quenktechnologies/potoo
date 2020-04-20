"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var either_1 = require("@quenk/noni/lib/data/either");
var error_1 = require("../runtime/error");
exports.CONSTANTS_INDEX_NUMBER = 0;
exports.CONSTANTS_INDEX_STRING = 1;
/**
 * PScript provides a constructor for creating Scripts.
 */
var PScript = /** @class */ (function () {
    function PScript(name, constants, info, code) {
        if (constants === void 0) { constants = [[], []]; }
        if (info === void 0) { info = []; }
        if (code === void 0) { code = []; }
        this.name = name;
        this.constants = constants;
        this.info = info;
        this.code = code;
    }
    return PScript;
}());
exports.PScript = PScript;
/**
 * getInfo retrivies an Info object from the info section.
 */
exports.getInfo = function (s, idx) {
    if (s.info[idx] == null)
        return either_1.left(new error_1.MissingInfoErr(idx));
    return either_1.right(s.info[idx]);
};
//# sourceMappingURL=index.js.map