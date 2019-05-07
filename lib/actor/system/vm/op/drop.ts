import { Runtime } from '../runtime';
import { Frame } from '../frame';
import { OP_CODE_DROP, Log, Op, Level } from './';

/**
 * Drop an unwanted message.
 *
 * Pops:
 *
 * 1. The message to be dropped.
 */
export class Drop implements Op {

    public code = OP_CODE_DROP

    public level = Level.Actor;

    exec(e: Runtime): void {

        let curr = e.current().get();

        let eitherMsg = curr.resolveMessage(curr.pop());

        if (eitherMsg.isLeft())
            return e.raise(eitherMsg.takeLeft());

        let m = eitherMsg.takeRight();

        e.drop(m);

    }

    toLog(f: Frame): Log {

        return ['drop', [], [f.peek()]];

    }

}
