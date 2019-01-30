import { tick } from '@quenk/noni/lib/control/timer';
import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Executor } from '../';
import {OP_CODE_RUN, Log, Op, Level } from './';

/**
 * Run invokes the run method of an actor given the address.
 * 
 * Pops
 * 1. The address of the current actor or child to be run.
 */
export class Run<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_RUN;

    public level = Level.Control;

    exec(e: Executor<C, S>): void {

        let curr = e.current().get();

        curr
            .resolveAddress(curr.pop())
            .map(addr => {
                e
                    .getContext(addr)
                    .map(ctx => tick(() => ctx.actor.run()))
            })
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame<C, S>): Log {

        return ['run', [], [f.peek()]];

    }

}
