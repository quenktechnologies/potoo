"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var address_1 = require("../../../../address");
var template_1 = require("../../../../template");
/**
 * alloc a Context for a new actor.
 *
 * The context is stored in the vm's state table.
 *
 * Stack:
 * <template>,<address> -> <address>
 */
exports.alloc = function (r, f, _) {
    var eParent = f.popString();
    var eTemp = f.popTemplate();
    if (eParent.isLeft())
        return r.raise(eParent.takeLeft());
    if (eTemp.isLeft())
        return r.raise(eTemp.takeLeft());
    var parent = eParent.takeRight();
    var temp = template_1.normalize(eTemp.takeRight());
    if (address_1.isRestricted(temp.id))
        return r.raise(new error.InvalidIdErr(temp.id));
    var addr = address_1.make(parent, temp.id);
    if (r.getContext(addr).isJust())
        return r.raise(new error.DuplicateAddressErr(addr));
    var ctx = r.allocate(addr, temp);
    r.putContext(addr, ctx);
    if (ctx.flags.router === true)
        r.putRoute(addr, addr);
    if (temp.group) {
        var groups = (typeof temp.group === 'string') ?
            [temp.group] : temp.group;
        groups.forEach(function (g) { return r.putMember(g, addr); });
    }
};
//# sourceMappingURL=alloc.js.map