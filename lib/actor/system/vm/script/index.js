"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfo = exports.PScript = exports.CONSTANTS_INDEX_STRING = exports.CONSTANTS_INDEX_NUMBER = void 0;
const either_1 = require("@quenk/noni/lib/data/either");
const error_1 = require("../runtime/error");
exports.CONSTANTS_INDEX_NUMBER = 0;
exports.CONSTANTS_INDEX_STRING = 1;
/**
 * PScript provides a constructor for creating Scripts.
 */
class PScript {
    constructor(name, constants = [[], []], info = [], code = []) {
        this.name = name;
        this.constants = constants;
        this.info = info;
        this.code = code;
    }
}
exports.PScript = PScript;
/**
 * getInfo retrivies an Info object from the info section.
 */
const getInfo = (s, idx) => {
    if (s.info[idx] == null)
        return (0, either_1.left)(new error_1.MissingInfoErr(idx));
    return (0, either_1.right)(s.info[idx]);
};
exports.getInfo = getInfo;
//# sourceMappingURL=index.js.map