import * as error from '../error';
import { Context } from '../../../context';
import { isRestricted, make } from '../../../address';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
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
export class Allocate<C extends Context, S extends Platform<C>> implements Op<C, S> {

    public code = OP_CODE_ALLOCATE;

    public level = Level.Actor;

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();
        let parent = curr.resolveAddress(curr.pop());
        let temp = curr.resolveTemplate(curr.pop());

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

      let ctx = e.allocate(addr, t);

      e.putContext(addr, ctx);

      if(ctx.flags.router === true)
      e.putRoute(addr, addr);

        curr.pushAddress(addr);

    }

    toLog(f: Frame<C, S>): Log {

        return ['allocate', [], [f.peek(), f.peek(1)]];

    }

}
