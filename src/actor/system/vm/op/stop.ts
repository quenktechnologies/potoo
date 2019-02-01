import * as error from '../error';
import { map } from '@quenk/noni/lib/data/record';
import { left, right } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { isChild } from '../../../address';
import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { OP_CODE_STOP, Log, Op, Level } from './';

/**
 * Stop an actor, all of it's children will also be stopped.
 *
 * Pops:
 * 1. Address of actor to stop.
 */
export class Stop<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_STOP;

    public level = Level.Control;

    exec(e: Runtime<C, S>): void {

        let curr = e.current().get();

        curr
            .resolveAddress(curr.pop())
            .chain(addr => {

                if ((!isChild(curr.actor, addr)) &&
                    (addr !== curr.actor))
                    return left<Err, string>(new error.IllegalStopErr(
                        curr.actor, addr));

                return right<Err, string>(addr);

            })
            .map(addr =>
                e
                    .getChildren(addr)
                    .map(ctxs =>
                        map(ctxs, (ctx, k) => {

                            ctx.actor.stop();
                            e.removeContext(k);

                        }))
                    .orJust(() => { })
                    .map(() =>
                        e
                            .getContext(addr)
                            .map(ctx => {

                                ctx.actor.stop();
                                e.removeContext(addr);

                            })))
            .lmap(err => e.raise(err));

    }

    toLog(f: Frame<C, S>): Log {

        return ['stop', [], [f.peek()]];

    }

}

