import * as log from '../log';
import { startsWith } from '@quenk/noni/lib/data/string';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Instance } from '../../';
import { Context } from '../../context';
import { getAddress } from '../state';
import { Stop } from './stop';
import { Raise } from './raise';
import { SystemError } from '../error';
import {System} from '../';
import { OP_KILL, Op, Executor } from './';

/**
 * IllegalKillSignalError
 */
export class IllegalKillSignalError extends SystemError {

    constructor(public child: string, public parent: string) {

        super(`The actor at address "${parent}" can not kill "${child}"!`);

    }

}

/**
 * Kill instruction.
 *
 * An actor can only kill actors it is directly or indirectly the parent of.
 */
export class Kill<C extends Context, S extends System<C>> extends Op<C,S> {

    constructor(public actor:Instance, public child: Address) { super(); }

    public code = OP_KILL;

    public level = log.WARN;

    exec(s: Executor<C,S>): void {

        execKill(s, this);

    }

}

const execKill = <C extends Context, S extends System<C>>
  (s: Executor<C,S>, { child, actor }: Kill<C,S>) =>
    getAddress(s.state, actor)
        .map(addr =>
            s.exec(startsWith(child, addr) ?
                new Stop(child) :
                new Raise(new IllegalKillSignalError(addr, child), addr, addr)))
        .orJust(noop)
        .get();
