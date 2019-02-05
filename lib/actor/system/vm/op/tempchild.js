"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var either_1 = require("@quenk/noni/lib/data/either");
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
        curr
            .resolveTemplate(curr.pop())
            .chain(function (t) {
            return curr
                .resolveNumber(curr.pop())
                .chain(function (n) {
                if ((t.children && t.children.length > n) && (n > 0)) {
                    var _a = curr.allocateTemplate(t.children[n]), value = _a[0], type = _a[1], location_1 = _a[2];
                    return either_1.right(curr.push(value, type, location_1));
                }
                else {
                    return either_1.left(new error.NullTemplatePointerErr(n));
                }
            });
        })
            .lmap(function (err) { return e.raise(err); });
    };
    TempChild.prototype.toLog = function (f) {
        return ['tempchild', [], [f.peek(), f.peek(1)]];
    };
    return TempChild;
}());
exports.TempChild = TempChild;
//# sourceMappingURL=tempchild.js.map