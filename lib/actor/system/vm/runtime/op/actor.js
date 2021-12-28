"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = exports.maildq = exports.mailcount = exports.recvcount = exports.recv = exports.send = exports.self = exports.alloc = void 0;
/**
 * alloc a VMThread for a new actor.
 *
 * The VMThread is stored in the vm's state table. If the generated address
 * already exists or is invalid an error will be raised.
 *
 * Stack:
 * <template>,<address> -> <address>
 */
exports.alloc = function (r, f, _) {
    var eTemp = f.popObject();
    if (eTemp.isLeft())
        return r.raise(eTemp.takeLeft());
    var temp = eTemp.takeRight().promote();
    var eParent = f.popString();
    if (eParent.isLeft())
        return r.raise(eParent.takeLeft());
    var eresult = r.vm.allocate(eParent.takeRight(), temp);
    if (eresult.isLeft()) {
        r.raise(eresult.takeLeft());
    }
    else {
        f.push(r.vm.heap.addString(f, eresult.takeRight()));
    }
};
/**
 * self puts the address of the current actor on to the stack.
 * TODO: make self an automatic variable
 */
exports.self = function (_, f, __) {
    f.pushSelf();
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
    r.context.receivers.push(einfo.takeRight());
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
    f.push(r.context.receivers.length);
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
    r.wait(r.vm.kill(r.context.actor, eaddr.takeRight()));
};
//# sourceMappingURL=actor.js.map