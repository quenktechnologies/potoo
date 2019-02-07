import * as error from '../error';
import { map } from '@quenk/noni/lib/data/record';
import { isChild } from '../../../address';
import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { OP_CODE_STOP, Log, Op, Level } from './';

/**
 * Stop an actor, all of it's children will also be stopped.
 *
 * Pops:
 * 1. Address of actor to stop.
 */
export class Stop<C extends Context, S extends Platform<C>> implements Op<C, S> {

    public code = OP_CODE_STOP;

    public level = Level.Control;

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();
        let eitherAddress = curr.resolveAddress(curr.pop());

        if (eitherAddress.isLeft())
            return e.raise(eitherAddress.takeLeft());

        let addr = eitherAddress.takeRight();

        if ((!isChild(curr.actor, addr)) && (addr !== curr.actor))
            return e.raise(new error.IllegalStopErr(curr.actor, addr));

        let maybeChilds = e.getChildren(addr);

        if (maybeChilds.isJust()) {

            let ctxs = maybeChilds.get();

            map(ctxs, (c, k) => { c.actor.stop(); e.removeContext(k); });

        }

        curr.context.actor.stop();

        e.removeContext(addr);

        e.clear();

    }

    toLog(f: Frame<C, S>): Log {

        return ['stop', [], [f.peek()]];

    }

}

