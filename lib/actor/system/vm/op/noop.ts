import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { OP_CODE_NOOP, Log, Level, Op } from './';

/**
 * Noop does nothing.
 */
export class Noop<C extends Context, S extends Platform<C>> implements Op<C, S> {

    public code = OP_CODE_NOOP;

    public level = Level.Base;

    exec(_: Runtime<C, S>) {

    }

    toLog(_: Frame<C, S>): Log {

        return ['noop', [], []];

    }

}
