import * as error from '../error';

import { isImmutable } from '../../../../flags';
import { Template } from '../../../../template';
import { Frame } from '../stack/frame';
import { Operand } from '../';
import { VMThread } from '../../thread';

/**
 * alloc a VMThread for a new actor.
 *
 * The VMThread is stored in the vm's state table. If the generated address
 * already exists or is invalid an error will be raised.
 *
 * Stack:
 * <template>,<address> -> <address>
 */
export const alloc = (r: VMThread, f: Frame, _: Operand) => {

    let eTemp = f.popObject();

    if (eTemp.isLeft()) return r.raise(eTemp.takeLeft());

    let temp = <Template>eTemp.takeRight().promote();

    let eParent = f.popString();

    if (eParent.isLeft()) return r.raise(eParent.takeLeft());

    let eresult = r.vm.allocate(eParent.takeRight(), temp);

    if (eresult.isLeft()) {

        r.raise(eresult.takeLeft());

    } else {

        f.push(r.vm.heap.addString(eresult.takeRight()));

    }

}

/**
 * self puts the address of the current actor on to the stack.
 * TODO: make self an automatic variable
 */
export const self = (_: VMThread, f: Frame, __: Operand) => {

    f.pushSelf();

}

/**
 * send a message to another actor.
 *
 * Stack:
 * <message>,<address> -> <uint8>
 */
export const send = (r: VMThread, f: Frame, _: Operand) => {

    let eMsg = f.popValue();

    if (eMsg.isLeft()) return r.raise(eMsg.takeLeft());

    let eAddr = f.popString();

    if (eAddr.isLeft()) return r.raise(eAddr.takeLeft());

    if (r.vm.sendMessage(eAddr.takeRight(), r.context.address, eMsg.takeRight()))
        f.pushUInt8(1);
    else
        f.pushUInt8(0);

}

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
export const recv = (r: VMThread, f: Frame, _: Operand) => {

    let einfo = f.popFunction();

    if (einfo.isLeft()) return r.raise( einfo.takeLeft());

    r.context.receivers.push(einfo.takeRight());

    if (r.context.mailbox.length > 0)
        r.context.actor.notify();

}

/**
 * recvcount pushes the total count of pending receives to the top of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export const recvcount = (r: VMThread, f: Frame, _: Operand) => {

    f.push(r.context.receivers.length);

}

/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 * 
 * Stack:
 *  -> <uint32>
 */
export const mailcount = (r: VMThread, f: Frame, _: Operand) => {

    f.push(r.context.mailbox.length);

}

/**
 * maildq pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
export const maildq = (_: VMThread, f: Frame, __: Operand) => {

    f.pushMessage();

}

/**
 * read a message from the top of the stack.
 *
 * A receiver function is applied from the actors pending receiver list.
 * <message> -> <uint32>
 */
export const read = (r: VMThread, f: Frame, __: Operand) => {

    let func = isImmutable(r.context.flags) ?
        r.context.receivers[0] : r.context.receivers.shift();

    if (func == null)
        return r.raise(new error.NoReceiveErr(r.context.address));

    if (func.foreign === true) {

        let emsg = f.popValue();

        if (emsg.isLeft())
            return r.raise(emsg.takeLeft());

        let msg = emsg.takeRight();

        r.invokeForeign(f, func, [msg]);

    } else {

        r.invokeVM(f, func);

    }

}

/**
 * stop an actor in the system.
 *
 * The actor will be removed.
 *
 * Stack:
 *
 * <address> ->
 */
export const stop = (r: VMThread, f: Frame, _: Operand) => {

    let eaddr = f.popString();

    if (eaddr.isLeft())
        return r.raise(eaddr.takeLeft());

    r.wait(r.vm.kill(r.context.actor, eaddr.takeRight()));

}
