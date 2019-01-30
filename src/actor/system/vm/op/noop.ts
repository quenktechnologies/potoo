import { Context } from '../../../context';
import { System } from '../../../system';
import { Frame } from '../frame';
import { Executor } from '../';
import {OP_CODE_NOOP, Log, Level, Op } from './';

/**
 * Noop does nothing.
 */
export class Noop<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_NOOP;

    public level = Level.Base;

    exec(_: Executor<C, S>) {

    }

    toLog(_: Frame<C, S>): Log {

        return ['noop', [], []];

    }

}
