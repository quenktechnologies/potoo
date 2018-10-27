import * as log from '../log';
import { startsWith } from '@quenk/noni/lib/data/string';
import { noop } from '@quenk/noni/lib/data/function';
import { Address } from '../../address';
import { Actor } from '../../';
import { Frame } from '../state/frame';
import { System } from '../';
import { Stop } from './stop';
import { Raise } from './raise';
import { SystemError } from '../error';
import { OP_KILL, Op } from './';

export class IllegalKillSignal extends SystemError {

    constructor(public child: string, public parent: string) {

        super(`The actor at address "${parent}" can not kill "${child}"!`);

    }

}

/**
 * Kill instruction.
 */
export class Kill extends Op {

    constructor(public child: Address, public actor: Actor) { super(); }

    public code = OP_KILL;

    public level = log.WARN;

    exec<F extends Frame>(s: System<F>): void {

        return execKill(s, this);

    }

}

/**
 * execKill 
 *
 * Verify the target child is somewhere in the hierachy of the requesting
 * actor before killing it.
 */
export const execKill = <F extends Frame>(s: System<F>, { child, actor }: Kill) =>
    s
        .state
        .getAddress(actor)
        .map(addr =>
            s.exec(startsWith(child, addr) ?
                new Stop(child) :
                new Raise(new IllegalKillSignal(addr, child), addr, addr)))
        .orJust(noop)
        .get();
