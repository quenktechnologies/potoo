import * as error from '../error';

import { tick } from '@quenk/noni/lib/control/timer';

import { isRestricted, make } from '../../../../address';
import { normalize } from '../../../../template';
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

export const read = (r: Runtime, f: Frame, _: Operand) => {

    if (r.context.behaviour.length <= 0) {

        r.vm.raise(new error.NoReceiveErr(r.context.address));

    } else {

        let eMsg = f.popMessage();

        if (eMsg.isLeft()) return r.vm.raise(eMsg.takeLeft());

        let m = eMsg.takeRight();

        let b = r.context.behaviour.pop();

        if (b.test(m)) {

            b.apply(m);

        } else {

            //TODO: drop event

        }


    }


}
