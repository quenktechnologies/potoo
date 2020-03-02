import * as error from '../error';

import { isRestricted, make } from '../../../../address';
import { normalize } from '../../../../template';
import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';

/**
 * alloc a Context for a new actor.
 *
 * The context is stored in the vm's state table.
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

    if (r.getContext(addr).isJust())
        return r.raise(new error.DuplicateAddressErr(addr));

    let ctx = r.allocate(addr, temp);

    r.putContext(addr, ctx);

    if (ctx.flags.router === true) r.putRoute(addr, addr);

    if (temp.group) {

        let groups = (typeof temp.group === 'string') ?
            [temp.group] : temp.group;

        groups.forEach(g => r.putMember(g, addr));

    }

}
