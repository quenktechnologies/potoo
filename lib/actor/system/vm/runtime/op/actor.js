"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var timer_1 = require("@quenk/noni/lib/control/timer");
var address_1 = require("../../../../address");
var template_1 = require("../../../../template");
var flags_1 = require("../../../../flags");
/**
 * alloc a Context for a new actor.
 *
 * The context is stored in the vm's state table. If the generated address
 * already exists or is invalid an error will be raised.
 *
 * TODO: push address.
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
    if (r.vm.getContext(addr).isJust())
        return r.raise(new error.DuplicateAddressErr(addr));
    var ctx = r.vm.allocate(addr, temp);
    r.vm.putContext(addr, ctx);
    if (flags_1.isRouter(ctx.flags))
        r.vm.putRoute(addr, addr);
    if (temp.group) {
        var groups = (typeof temp.group === 'string') ?
            [temp.group] : temp.group;
        groups.forEach(function (g) { return r.vm.putMember(g, addr); });
    }
};
/**
 * run triggers the run code for an actor.
 *
 * Stack:
 * <address> ->
 */
exports.run = function (r, f, _) {
    var eTarget = f.popString();
    if (eTarget.isLeft())
        return r.raise(eTarget.takeLeft());
    var target = eTarget.takeRight();
    var mCtx = r.vm.getContext(target);
    if (mCtx.isNothing())
        return r.raise(new error.UnknownAddressErr(target));
    var ctx = mCtx.get();
    //TODO: Why do we run in the next tick?
    timer_1.tick(function () { return ctx.actor.run(); });
};
/**
 * send a message to another actor.
 *
 * The value
 *
 * Stack:
 * <message>,<address> -> <uint8>
 */
exports.send = function (r, f, _) {
    var eMsg = f.popValue();
    if (eMsg.isLeft())
        return r.raise(eMsg.takeLeft());
    var eAddr = f.popString();
    if (eAddr.isLeft())
        return r.raise(eAddr.takeLeft());
    var msg = eMsg.takeRight();
    var addr = eAddr.takeRight();
    var mRouter = r.vm.getRouter(addr);
    var mCtx = mRouter.isJust() ? mRouter : r.vm.getContext(addr);
    if (mCtx.isJust()) {
        var ctx = mCtx.get();
        if (flags_1.isBuffered(ctx.flags)) {
            ctx.mailbox.push(msg);
        }
        else {
            ctx.actor.accept(msg);
        }
        f.pushUInt8(1);
    }
    else {
        f.pushUInt8(0);
    }
};
/**
 * recv schedules a receiver function for the next available message.
 *
 * Currently only supports foreign functions.
 * Will invoke the actor's notify() method if there are pending
 * messages.
 *
 * Stack:
 * <function> ->
 */
exports.recv = function (r, f, _) {
    var einfo = f.popFunction();
    if (einfo.isLeft())
        return r.raise(einfo.takeLeft());
    var info = einfo.takeRight();
    if (!info.foreign)
        r.raise(new Error('recv: Only foriegn functions allowed!'));
    r.context.behaviour.push(info.exec);
    if (r.context.mailbox.length > 0)
        r.context.actor.notify();
};
/**
 * recvcount pushes the total count of pending receives to the top of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
exports.recvcount = function (r, f, _) {
    f.pushUInt32(r.context.behaviour.length);
};
/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
exports.mailcount = function (r, f, _) {
    f.pushUInt32(r.context.mailbox.length);
};
/**
 * pushmsg pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
exports.pushmsg = function (_, f, __) {
    f.pushMessage();
};
//# sourceMappingURL=actor.js.map