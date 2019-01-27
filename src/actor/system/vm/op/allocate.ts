import * as error from '../error';
import { tick } from '@quenk/noni/lib/control/timer';
import { Context } from '../../../context';
import { isRestricted, make } from '../../../address';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_ALLOCATE = 0x5;

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
export class Allocate<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_ALLOCATE;

    public level = Level.Actor;

    exec(e: Executor<C, S>): void {

        let parent = e.current.resolveAddress(e.current.pop());
        let temp = e.current.resolveTemplate(e.current.pop());

        if (parent.isLeft())
            return e.raise(parent.takeLeft());

        if (temp.isLeft())
            return e.raise(temp.takeLeft());

        let p = parent.takeRight();
        let t = temp.takeRight();

        if (isRestricted(t.id))
            return e.raise(new error.InvalidIdErr(t.id));

        let addr = make(p, t.id);

        if (e.getContext(addr).isJust())
            return e.raise(new error.DuplicateAddressErr(addr));

        e.putContext(addr, e.allocate(t));

        tick(() => e.getContext(addr).map(c => c.actor.run()));

        e.current.pushAddress(addr);

    }

    toLog(): string {

        return `allocate`;

    }

}
