import * as error from '../error';
import * as events from '../../event';

import { isImmutable } from '../../../../flags';
import { Template } from '../../template';
import { Frame } from '../stack/frame';
import { ForeignFunInfo } from '../../script/info';
import { Receiver } from '../context';
import { Runtime, Operand } from '../';

/**
 * alloc a Runtime for a new actor.
 *
 * The Runtime is stored in the vm's state table. If the generated address
 * already exists or is invalid an error will be raised.
 *
 * Stack:
 * <template>,<address> -> <address>
 */
export const alloc = (r: Runtime, f: Frame, _: Operand) => {

    let eTemp = f.popObject();

    if (eTemp.isLeft()) return r.raise(eTemp.takeLeft());

    let temp = <Template>eTemp.takeRight().promote();

    let eParent = f.popString();

    if (eParent.isLeft()) return r.raise(eParent.takeLeft());

    let eresult = r.vm.allocate(eParent.takeRight(), temp);

    if (eresult.isLeft()) {

        r.raise(eresult.takeLeft());

    } else {

        f.push(f.heap.addString(eresult.takeRight()));

    }

}

/**
 * self puts the address of the current actor on to the stack.
 * TODO: make self an automatic variable
 */
export const self = (_: Runtime, f: Frame, __: Operand) => {

    f.pushSelf();

}

/**
 * run triggers the run code for an actor.
 * 
 * Stack:
 * <address> -> 
 */
export const run = (r: Runtime, f: Frame, _: Operand) => {

    let eTarget = f.popString();

    if (eTarget.isLeft()) return r.raise(eTarget.takeLeft());

    let eResult = r.vm.runActor(eTarget.takeRight());

    if (eResult.isLeft())
        r.raise(eResult.takeLeft());

}

/**
 * send a message to another actor.
 *
 * Stack:
 * <message>,<address> -> <uint8>
 */
export const send = (r: Runtime, f: Frame, _: Operand) => {

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
export const recv = (r: Runtime, f: Frame, _: Operand) => {

    let einfo = f.popFunction();

    if (einfo.isLeft()) return r.raise(einfo.takeLeft());

    let info = <ForeignFunInfo>einfo.takeRight();

    if (info.exec == null)
        r.raise(new Error('recv: Only foriegn functions allowed!'));

    r.context.behaviour.push(<Receiver>info.exec);

    if (r.context.mailbox.length > 0)
        r.context.actor.notify();

}

/**
 * recvcount pushes the total count of pending receives to the top of the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export const recvcount = (r: Runtime, f: Frame, _: Operand) => {

    f.push(r.context.behaviour.length);

}

/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 * 
 * Stack:
 *  -> <uint32>
 */
export const mailcount = (r: Runtime, f: Frame, _: Operand) => {

    f.push(r.context.mailbox.length);

}

/**
 * maildq pushes the earliest message in the mailbox (if any).
 *
 * Stack:
 *
 *  -> <message>?
 */
export const maildq = (_: Runtime, f: Frame, __: Operand) => {

    f.pushMessage();

}

/**
 * read a message from the top of the stack.
 *
 * A receiver function is applied from the actors pending receiver list.
 * <message> -> <uint32>
 */
export const read = (r: Runtime, f: Frame, __: Operand) => {

    let emsg = f.popValue();

    if (emsg.isLeft())
        return r.raise(emsg.takeLeft());

    let msg = emsg.takeRight();

    let func = isImmutable(r.context.flags) ?
        r.context.behaviour[0] : r.context.behaviour.shift();

    if (func == null)
        return r.raise(new error.NoReceiveErr(r.context.address));

    if (func(r, msg)) {

        r.vm.trigger(r.context.address, events.EVENT_MESSAGE_READ, msg);

        f.push(1);

    } else {

        r.vm.trigger(r.context.address, events.EVENT_MESSAGE_DROPPED, msg);

        f.push(0);

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
export const stop = (r: Runtime, f: Frame, _: Operand) => {

    let eaddr = f.popString();

    if (eaddr.isLeft())
        return r.raise(eaddr.takeLeft());

    let eresult = r.kill(eaddr.takeRight());

    if (eresult.isLeft())
        r.raise(eresult.takeLeft());

}
