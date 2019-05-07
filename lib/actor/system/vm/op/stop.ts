import * as error from '../error';
import { map } from '@quenk/noni/lib/data/record';
import { isChild, isGroup } from '../../../address';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_STOP, Log, Op, Level } from './';

/**
 * Stop an actor, all of it's children will also be stopped.
 *
 * Pops:
 * 1. Address of actor to stop.
 */
export class Stop implements Op {

    public code = OP_CODE_STOP;

    public level = Level.Control;

    exec(e: Runtime): void {

        let curr = e.current().get();
        let eitherAddress = curr.resolveAddress(curr.pop());

        if (eitherAddress.isLeft())
            return e.raise(eitherAddress.takeLeft());

        let addr = eitherAddress.takeRight();

        let addrs = isGroup(addr) ?
            e.getGroup(addr).orJust(() => []).get() : [addr];

        addrs.every(a => {

            if ((!isChild(curr.actor, a)) && (a !== curr.actor)) {

                e.raise(new error.IllegalStopErr(curr.actor, a));
                return false;

            }

            let maybeChilds = e.getChildren(a);

            if (maybeChilds.isJust()) {

                let ctxs = maybeChilds.get();

                map(ctxs, (c, k) => { c.actor.stop(); e.removeContext(k); });

            }

            let maybeTarget = e.getContext(a);

            if (maybeTarget.isJust()) {

                maybeTarget.get().actor.stop();
                e.removeContext(a);

            }

            e.clear();

            return true;

        })

    }

    toLog(f: Frame): Log {

        return ['stop', [], [f.peek()]];

    }

}

