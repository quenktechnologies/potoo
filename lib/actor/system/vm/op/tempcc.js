"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * TempCC counts the number of child templates a template has.
 *
 * Pops:
 *
 * 1: Reference to the template to count.
 */
var TempCC = /** @class */ (function () {
    function TempCC() {
        this.code = _1.OP_CODE_TEMP_CC;
        this.level = _1.Level.Control;
    }
    TempCC.prototype.exec = function (e) {
        var curr = e.current().get();
        curr
            .resolveTemplate(curr.pop())
            .map(function (temp) { return temp.children && temp.children.length || 0; })
            .map(function (count) { return curr.pushNumber(count); })
            .lmap(function (err) { return e.raise(err); });
    };
    TempCC.prototype.toLog = function (f) {
        return ['tempcc', [], [f.peek()]];
    };
    return TempCC;
}());
exports.TempCC = TempCC;
//# sourceMappingURL=tempcc.js.map