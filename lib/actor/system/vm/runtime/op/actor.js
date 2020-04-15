"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var events = require("../../event");
var flags_1 = require("../../../../flags");
/**
 * alloc a Runtime for a new actor.
 *
 * The Runtime is stored in the vm's state table. If the generated address
 * already exists or is invalid an error will be raised.
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
    var eresult = r.vm.allocate(eParent.takeRight(), eTemp.takeRight());
    if (eresult.isLeft()) {
        r.raise(eresult.takeLeft());
    }
    else {
        f.push(f.heap.addString(eresult.takeRight()));
    }
};
/**
 * self puts the address of the current actor on to the stack.
 */
exports.self = function (_, f, __) {
    f.pushSelf();
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
    var eResult = r.vm.runActor(eTarget.takeRight());
    if (eResult.isLeft())
        r.raise(eResult.takeLeft());
};
/**
 * send a message to another actor.
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
    if (r.vm.sendMessage(eAddr.takeRight(), r.context.address, eMsg.takeRight()))
        f.pushUInt8(1);
    else
        f.pushUInt8(0);
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
    f.push(r.context.behaviour.length);
};
/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
exports.mailcount = function (r, f, _) {
    f.push(r.context.mailbox.length);
};
/**
 * maildq pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
exports.maildq = function (_, f, __) {
    f.pushMessage();
};
/**
 * read a message from the top of the stack.
 *
 * A receiver function is applied from the actors pending receiver list.
 * <message> -> <uint32>
 */
exports.read = function (r, f, __) {
    var emsg = f.popValue();
    if (emsg.isLeft())
        return r.raise(emsg.takeLeft());
    var msg = emsg.takeRight();
    var func = flags_1.isImmutable(r.context.flags) ?
        r.context.behaviour[0] : r.context.behaviour.shift();
    if (func == null)
        return r.raise(new error.NoReceiveErr(r.context.address));
    if (func(msg)) {
        r.vm.trigger(r.context.address, events.EVENT_MESSAGE_READ, msg);
        f.push(1);
    }
    else {
        r.vm.trigger(r.context.address, events.EVENT_MESSAGE_DROPPED, msg);
        f.push(0);
    }
};
/**
 * stop an actor in the system.
 *
 * The actor will be removed.
 *
 * Stack:
 *
 * <address> ->
 */
exports.stop = function (r, f, _) {
    var eaddr = f.popString();
    if (eaddr.isLeft())
        return r.raise(eaddr.takeLeft());
    var eresult = r.kill(eaddr.takeRight());
    if (eresult.isLeft())
        r.raise(eresult.takeLeft());
};
//# sourceMappingURL=actor.js.map