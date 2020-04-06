import * as error from '../error';

import { tick } from '@quenk/noni/lib/control/timer';

import { isRestricted, make } from '../../../../address';
import { normalize } from '../../../../template';
import { isRouter, isBuffered } from '../../../../flags';
import { Frame } from '../stack/frame';
import { Receiver } from '../context';
import { Runtime, Operand } from '../';

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
export const alloc = (r: Runtime, f: Frame, _: Operand) => {

    let eParent = f.popString();

    let eTemp = f.popTemplate();

    if (eParent.isLeft()) return r.raise(eParent.takeLeft());

    if (eTemp.isLeft()) return r.raise(eTemp.takeLeft());

    let parent = eParent.takeRight();

    let temp = normalize(eTemp.takeRight());

    if (isRestricted(temp.id))
        return r.raise(new error.InvalidIdErr(temp.id));

    let addr = make(parent, temp.id);

    if (r.vm.getContext(addr).isJust())
        return r.raise(new error.DuplicateAddressErr(addr));

    let ctx = r.vm.allocate(addr, temp);

    r.vm.putContext(addr, ctx);

    if (isRouter(ctx.flags))
        r.vm.putRoute(addr, addr);

    if (temp.group) {

        let groups = (typeof temp.group === 'string') ?
            [temp.group] : temp.group;

        groups.forEach(g => r.vm.putMember(g, addr));

    }

}

/**
 * self puts the address of the current actor on to the stack.
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

    let target = eTarget.takeRight();

    let mCtx = r.vm.getContext(target);

    if (mCtx.isNothing())
        return r.raise(new error.UnknownAddressErr(target));

    let ctx = mCtx.get();

    //TODO: Why do we run in the next tick?
    tick(() => ctx.actor.start());

}

/**
 * send a message to another actor.
 *
 * The value 
 *
 * Stack:
 * <message>,<address> -> <uint8>
 */
export const send = (r: Runtime, f: Frame, _: Operand) => {

    let eMsg = f.popValue();

    if (eMsg.isLeft()) return r.raise(eMsg.takeLeft());

    let eAddr = f.popString();

    if (eAddr.isLeft()) return r.raise(eAddr.takeLeft());

    let msg = eMsg.takeRight();

    let addr = eAddr.takeRight();

    let mRouter = r.vm.getRouter(addr);

    let mCtx = mRouter.isJust() ? mRouter : r.vm.getContext(addr);

    if (mCtx.isJust()) {

        let ctx = mCtx.get();

        if (isBuffered(ctx.flags)) {

            ctx.mailbox.push(msg);

            ctx.actor.notify();

        } else {

            ctx.actor.accept(msg);

        }

        //TODO: EVENT_MESSAGE_SEND_OK
        f.pushUInt8(1);

    } else {

        //TODO: EVENT_MESSAGE_SEND_FAILED
        f.pushUInt8(0);

    }

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

    let info = einfo.takeRight();

    if (!info.foreign)
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

    f.pushUInt32(r.context.behaviour.length);

}

/**
 * mailcount pushes the number of messages in the actor's mailbox onto the top
 * of the stack.
 * 
 * Stack:
 *  -> <uint32>
 */
export const mailcount = (r: Runtime, f: Frame, _: Operand) => {

    f.pushUInt32(r.context.mailbox.length);

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
 * <message> -> <uint8>
 */
export const read = (r: Runtime, f: Frame, __: Operand) => {

    let emsg = f.popValue();

    if (emsg.isLeft())
        return r.raise(emsg.takeLeft());

    let msg = emsg.takeRight();

    let func = r.context.behaviour.shift();

    if (func == null)
        return r.raise(new error.NoReceiveErr(r.context.address));

    ///TODO: EVENT_MESSAGE_READ | EVENT_MESSAGE_REJECTED
    if (func(msg))
        f.pushUInt8(1);
    else
        f.pushUInt8(0);

}
