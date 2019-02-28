"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var address_1 = require("../../../address");
var _1 = require("./");
/**
 * Allocate a new Context frame for an actor from a template.
 *
 * Pops:
 * 1: Address of the parent actor.
 * 2: Pointer to the template to use from the templates table.
 *
 * Raises:
 * InvalidIdErr
 * UnknownParentAddressErr
 * DuplicateAddressErr
 */
var Allocate = /** @class */ (function () {
    function Allocate() {
        this.code = _1.OP_CODE_ALLOCATE;
        this.level = _1.Level.Actor;
    }
    Allocate.prototype.exec = function (e) {
        var curr = e.current().get();
        var parent = curr.resolveAddress(curr.pop());
        var temp = curr.resolveTemplate(curr.pop());
        if (parent.isLeft())
            return e.raise(parent.takeLeft());
        if (temp.isLeft())
            return e.raise(temp.takeLeft());
        var p = parent.takeRight();
        var t = temp.takeRight();
        if (address_1.isRestricted(t.id))
            return e.raise(new error.InvalidIdErr(t.id));
        var addr = address_1.make(p, t.id);
        if (e.getContext(addr).isJust())
            return e.raise(new error.DuplicateAddressErr(addr));
        var ctx = e.allocate(addr, t);
        e.putContext(addr, ctx);
        if (ctx.flags.router === true)
            e.putRoute(addr, addr);
        curr.pushAddress(addr);
    };
    Allocate.prototype.toLog = function (f) {
        return ['allocate', [], [f.peek(), f.peek(1)]];
    };
    return Allocate;
}());
exports.Allocate = Allocate;
//# sourceMappingURL=allocate.js.map