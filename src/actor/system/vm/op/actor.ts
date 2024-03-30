import { SharedThread } from '../thread/shared';
import { Frame } from '../frame';
import { Template } from '../../../template';
import { Operand } from '.';

/**
 * alloc allocates resources for a new child actor.
 *
 * TOS must be an instance of PTTemplate or an error will be raised.
 * The address of the new actor is pushed onto the stack.
 *
 * Stack:
 * <template> -> <address>
 */
export const alloc = (thread: SharedThread, frame: Frame, _: Operand) => {
    let eTemp = frame.popObject();

    if (eTemp.isLeft()) return thread.raise(eTemp.takeLeft());

    let tmpl = eTemp.takeRight();

    //TODO: if(!isTemplateLike(tmpl)) return thread.raise(new Error('alloc: Cannot allocate non-template!'));

    let eresult = thread.vm.allocate(thread, <Template>tmpl);

    if (eresult.isLeft()) {
        thread.raise(eresult.takeLeft());
    } else {
        frame.push(thread.vm.registry.addString(eresult.takeRight()));
    }
};

/**
 * self puts the address of the current actor on to the stack.
 * TODO: make self an automatic variable
 */
export const self = (_: SharedThread, f: Frame, __: Operand) => {
    f.pushSelf();
};

/**
 * send a message to another actor.
 *
 * Stack:
 * <message>,<address> -> <uint8>
 */
export const send = (r: SharedThread, f: Frame, _: Operand) => {
    let eMsg = f.popValue();

    if (eMsg.isLeft()) return r.raise(eMsg.takeLeft());

    let eAddr = f.popString();

    if (eAddr.isLeft()) return r.raise(eAddr.takeLeft());

    r.vm.sendMessage(r, eAddr.takeRight(), eMsg.takeRight());
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
export const recv = (r: SharedThread, f: Frame, _: Operand) => {
    let einfo = f.popFunction();

    if (einfo.isLeft()) return r.raise(einfo.takeLeft());

    r.watch(r.receive());
};

/**
 * recvcount pushes the total count of pending receives to the top of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export const recvcount = (r: SharedThread, f: Frame, _: Operand) => {
    f.push(r.context.receivers.length);
};

/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export const mailcount = (r: SharedThread, f: Frame, _: Operand) => {
    f.push(r.context.mailbox.length);
};

/**
 * maildq pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
export const maildq = (_: SharedThread, f: Frame, __: Operand) => {
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
export const stop = (r: SharedThread, f: Frame, _: Operand) => {
    let eaddr = f.popString();

    if (eaddr.isLeft()) return r.raise(eaddr.takeLeft());

    r.watch(r.kill(eaddr.takeRight()));
};
