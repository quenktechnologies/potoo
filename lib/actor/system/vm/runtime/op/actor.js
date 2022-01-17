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
const alloc = (r, f, _) => {
    let eTemp = f.popObject();
    if (eTemp.isLeft())
        return r.raise(eTemp.takeLeft());
    let temp = eTemp.takeRight().promote();
    let eParent = f.popString();
    if (eParent.isLeft())
        return r.raise(eParent.takeLeft());
    let eresult = r.vm.allocate(eParent.takeRight(), temp);
    if (eresult.isLeft()) {
        r.raise(eresult.takeLeft());
    }
    else {
        f.push(r.vm.heap.addString(f, eresult.takeRight()));
    }
};
exports.alloc = alloc;
/**
 * self puts the address of the current actor on to the stack.
 * TODO: make self an automatic variable
 */
const self = (_, f, __) => {
    f.pushSelf();
};
exports.self = self;
/**
 * send a message to another actor.
 *
 * Stack:
 * <message>,<address> -> <uint8>
 */
const send = (r, f, _) => {
    let eMsg = f.popValue();
    if (eMsg.isLeft())
        return r.raise(eMsg.takeLeft());
    let eAddr = f.popString();
    if (eAddr.isLeft())
        return r.raise(eAddr.takeLeft());
    if (r.vm.sendMessage(eAddr.takeRight(), r.context.address, eMsg.takeRight()))
        f.pushUInt8(1);
    else
        f.pushUInt8(0);
};
exports.send = send;
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
const recv = (r, f, _) => {
    let einfo = f.popFunction();
    if (einfo.isLeft())
        return r.raise(einfo.takeLeft());
    r.context.receivers.push(einfo.takeRight());
    if (r.context.mailbox.length > 0)
        r.context.actor.notify();
};
exports.recv = recv;
/**
 * recvcount pushes the total count of pending receives to the top of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
const recvcount = (r, f, _) => {
    f.push(r.context.receivers.length);
};
exports.recvcount = recvcount;
/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
const mailcount = (r, f, _) => {
    f.push(r.context.mailbox.length);
};
exports.mailcount = mailcount;
/**
 * maildq pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
const maildq = (_, f, __) => {
    f.pushMessage();
};
exports.maildq = maildq;
/**
 * stop an actor in the system.
 *
 * The actor will be removed.
 *
 * Stack:
 *
 * <address> ->
 */
const stop = (r, f, _) => {
    let eaddr = f.popString();
    if (eaddr.isLeft())
        return r.raise(eaddr.takeLeft());
    r.wait(r.vm.kill(r.context.actor, eaddr.takeRight()));
};
exports.stop = stop;
//# sourceMappingURL=actor.js.map