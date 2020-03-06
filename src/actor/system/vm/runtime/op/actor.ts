import * as error from '../error';

import { tick } from '@quenk/noni/lib/control/timer';

import { isRestricted, make } from '../../../../address';
import { normalize } from '../../../../template';
import { Receiver } from '../../../../context';
import { isRouter, isBuffered } from '../../../../flags';
import { Frame } from '../stack/frame';
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

    if (eParent.isLeft()) return r.vm.raise(eParent.takeLeft());

    if (eTemp.isLeft()) return r.vm.raise(eTemp.takeLeft());

    let parent = eParent.takeRight();

    let temp = normalize(eTemp.takeRight());

    if (isRestricted(temp.id))
        return r.vm.raise(new error.InvalidIdErr(temp.id));

    let addr = make(parent, temp.id);

    if (r.vm.getContext(addr).isJust())
        return r.vm.raise(new error.DuplicateAddressErr(addr));

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
 * run triggers the run code for an actor.
 * 
 * Stack:
 * <address> -> 
 */
export const run = (r: Runtime, f: Frame, _: Operand) => {

    let eTarget = f.popString();

    if (eTarget.isLeft()) return r.vm.raise(eTarget.takeLeft());

    let target = eTarget.takeRight();

    let mCtx = r.vm.getContext(target);

    if (mCtx.isNothing())
        return r.vm.raise(new error.UnknownAddressErr(target));

    let ctx = mCtx.get();

    //TODO: Why do we run in the next tick?
    tick(() => ctx.actor.run());

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

    let eMsg = f.popMessage();

    if (eMsg.isLeft()) return r.vm.raise(eMsg.takeLeft());

    let eAddr = f.popString();

    if (eAddr.isLeft()) return r.vm.raise(eAddr.takeLeft());

    let msg = eMsg.takeRight();

    let addr = eAddr.takeRight();

    let mRouter = r.vm.getRouter(addr);

    let mCtx = mRouter.isJust() ? mRouter : r.vm.getContext(addr);

    if (mCtx.isJust()) {

        let ctx = mCtx.get();

        if (isBuffered(ctx.flags)) {

            ctx.mailbox.push(msg);

        } else {

            ctx.actor.accept(msg);

        }

        f.pushUInt8(1);

    } else {

        f.pushUInt8(0);

    }

}

/**
 * read applies the actors next Receiver to the message at the top of the stack.
 *
 * Pushes 1 if the message was accepted, 0 if dropped.
 * Stack:
 * <message> -> <uint32>
 */
export const read = (r: Runtime, f: Frame, _: Operand) => {

    if (r.context.behaviour.length <= 0)
        return r.vm.raise(new error.NoReceiveErr(r.context.address));

    let b = <Receiver>r.context.behaviour.pop();

    let eMsg = f.popMessage();

    if (eMsg.isLeft())
        return r.vm.raise(eMsg.takeLeft());

    let m = eMsg.takeRight();

    if (b.test(m)) {

        //TODO: async support
        b.apply(m);

        f.push(1);

    } else {

        //TODO: drop event

        f.push(0);

    }

}

/**
 * recv schedules a receiver for the next available message.
 *
 * Will invoke the actor's notify() method if there are pending
 * messages.
 *
 * Stack:
 * <receiver> -> 
 */
export const recv = (r: Runtime, f: Frame, _: Operand) => {

    let erec = f.popReceiver();

    if (erec.isLeft()) return r.vm.raise(erec.takeLeft());

    r.context.behaviour.push(erec.takeRight());

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
