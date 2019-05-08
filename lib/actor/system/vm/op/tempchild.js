"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var _1 = require("./");
/**
 * TempChild copies a template's child onto the heap.
 *
 * Pops:
 * 1: Pointer to the template.
 * 2: Index of the child template.
 */
var TempChild = /** @class */ (function () {
    function TempChild() {
        this.code = _1.OP_CODE_TEMP_CHILD;
        this.level = _1.Level.Control;
    }
    TempChild.prototype.exec = function (e) {
        var curr = e.current().get();
        var eitherTemplate = curr.resolveTemplate(curr.pop());
        if (eitherTemplate.isLeft())
            return e.raise(eitherTemplate.takeLeft());
        var t = eitherTemplate.takeRight();
        var eitherNum = curr.resolveNumber(curr.pop());
        if (eitherNum.isLeft())
            return e.raise(eitherNum.takeLeft());
        var n = eitherNum.takeRight();
        if ((t.children && t.children.length > n) && (n > 0)) {
            var _a = curr.allocateTemplate(t.children[n]), value = _a[0], type = _a[1], location_1 = _a[2];
            curr.push(value, type, location_1);
        }
        else {
            e.raise(new error.NullTemplatePointerErr(n));
        }
    };
    TempChild.prototype.toLog = function (f) {
        return ['tempchild', [], [f.peek(), f.peek(1)]];
    };
    return TempChild;
}());
exports.TempChild = TempChild;
//# sourceMappingURL=tempchild.js.map