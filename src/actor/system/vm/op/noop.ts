import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_NOOP, Log, Level, Op } from './';

/**
 * Noop does nothing.
 */
export class Noop implements Op {

    public code = OP_CODE_NOOP;

    public level = Level.Base;

    exec(_: Runtime) {}

    toLog(_: Frame): Log {

        return ['noop', [], []];

    }

}
