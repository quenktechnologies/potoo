import { map } from '@quenk/noni/lib/data/record';
import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Op, Level } from './';

export const OP_CODE_STOP = 0x9;

/**
 * Stop an actor, all of it's children will also be stopped.
 *
 * Pops:
 * 1. Address of actor to stop.
 */
export class Stop<C extends Context, S extends System<C>> implements Op<C, S> {

    constructor() { }

    public code = OP_CODE_STOP;

    public level = Level.Control;

    exec(e: Executor<C, S>): void {

        e
            .current
            .resolveAddress(e.current.pop())
            .map(addr =>
                e
                    .getChildren(addr)
                    .map(ctxs =>
                        map(ctxs, (ctx, k) => {

                            ctx.actor.stop();
                            e.removeContext(k);

                        }))
                    .orJust(() => { })
                    .map(() => e.removeContext(addr)))
            .lmap(err => e.raise(err));

    }

    toLog(): string {

        return 'stop';

    }

}

