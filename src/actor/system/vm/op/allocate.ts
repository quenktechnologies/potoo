import * as error from '../error';

import { isRestricted, make, randomID } from '../../../address';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_ALLOCATE, Log, Op, Level } from './';

/**
 * Allocate a new Context frame for an actor from a template.
 *
 * Pops:
 * 1: Address of the parent actor.
 * 2: Pointer to the template to use from the templates table.
 *
 * Raises:
 * InvalidIdErr
 * UnknownParentAddressErr
 * DuplicateAddressErr
 */
export class Allocate implements Op {

    public code = OP_CODE_ALLOCATE;

    public level = Level.Actor;

    exec(e: Runtime): void {

        let curr = e.current().get();
        let parent = curr.resolveAddress(curr.pop());
        let temp = curr.resolveTemplate(curr.pop());

        if (parent.isLeft())
            return e.raise(parent.takeLeft());

        if (temp.isLeft())
            return e.raise(temp.takeLeft());

        let p = parent.takeRight();
        let t = temp.takeRight();

        let id = (t.id != null) ? t.id : randomID();

        if (isRestricted(id))
            return e.raise(new error.InvalidIdErr(id));

        let addr = make(p, id);

        if (e.getContext(addr).isJust())
            return e.raise(new error.DuplicateAddressErr(addr));

        let ctx = e.allocate(addr, t);

        e.putContext(addr, ctx);

        if (ctx.flags.router === true)
            e.putRoute(addr, addr);

        if (t.group) {

            let groups = (typeof t.group === 'string') ? [t.group] : t.group;

            groups.forEach(g => e.putMember(g, addr));

        }

        curr.pushAddress(addr);

    }

    toLog(f: Frame): Log {

        return ['allocate', [], [f.peek(), f.peek(1)]];

    }

}
