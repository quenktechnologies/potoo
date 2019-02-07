import { Context } from '../../../context';
import { Runtime } from '../runtime';
import {Frame} from '../frame';
import { Platform } from '../';
import { OP_CODE_DROP, Log, Op, Level } from './';

/**
 * Drop an unwanted message.
 *
 * Pops:
 *
 * 1. The message to be dropped.
 */
export class Drop<C extends Context, S extends Platform<C>> implements Op<C, S> {

    public code = OP_CODE_DROP

    public level = Level.Actor;

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();

        let eitherMsg = curr.resolveMessage(curr.pop());

        if (eitherMsg.isLeft())
            return e.raise(eitherMsg.takeLeft());

        let m = eitherMsg.takeRight();

        e.drop(m);

    }

  toLog(f:Frame<C,S>): Log {

        return ['drop', [], [f.peek()]];

    }

}
