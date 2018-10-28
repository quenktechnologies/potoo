import * as address from '../address';
import * as config from './configuration';
import { just, nothing } from '@quenk/noni/lib/data/maybe';
import { merge } from '@quenk/noni/lib/data/record';
import { ADDRESS_DISCARD, Address } from '../address';
import { Template } from '../template';
import { Actor, Behaviour } from '../';
import { Spawn } from './op/spawn';
import { Drop } from './op/drop';
import { Op, log } from './op';
import { Err } from '../err';
import { Envelope } from './mailbox';
import { ActorFrame } from './state/frame';
import { Initializer } from '../';
import { State } from './state';
import { Executor } from './op';

/**
 * System represents a dynamic collection of actors that 
 * share the JS event loop.
 */
export interface System extends Actor {

    /**
     * identify an actor instance.
     *
     * If the actor is unknown the ADDRESS_DISCARD should be returned.
     */
    identify(a: Actor): Address;

    /**
     * exec queses up an Op to be executed by the System.
     */
    exec(code: Op): System;

}


/**
 * @private
 */
class SysT {

    public id = address.ADDRESS_SYSTEM;

    public create = () => { throw new Error('Illegal attempt to restart system!'); }

    public trap = (e: Err) => {

        if (e instanceof Error) { throw e; } else { throw new Error(e.message); }

    }

}

/**
 * ActorSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export class ActorSystem implements System, Executor<ActorFrame> {

    constructor(
        public stack: Op[],
        public configuration: config.Configuration) { }

    state: State<ActorFrame> = new State({ $: nullFrame(this) }, {});

    running: boolean = false;

    init(): Initializer {

        return [undefined, { immutable: true, buffered: false }];

    }

    exec(code: Op): ActorSystem {

        this.stack.push(code);
        this.run();
        return this;

    }

    accept({ to, from, message }: Envelope): ActorSystem {

        return this.exec(new Drop(to, from, message));

    }

    stop(): void {

        throw new Error('The system has been stopped!');

    }

    allocate(t: Template): ActorFrame {

        let a = t.create(this);
        let i = a.init();
        let flags = flagDefaults(i[1] || {});
        let stack: Behaviour[] = i[0] ? [<Behaviour>i[0]] : [];

        return new ActorFrame(flags.buffered ? just([]) : nothing(),
            a, stack, flags, t);

    }

    spawn(t: Template): ActorSystem {

        this.exec(new Spawn(this, t));
        return this;

    }

    identify(actor: Actor): Address {

        return this
            .state
            .getAddress(actor)
            .orJust(() => ADDRESS_DISCARD)
            .get();

    }

    run(): void {

        let { level, logger } = <config.LogPolicy>this.configuration.log;

        if (this.running) return;

        this.running = true;

        while (this.stack.length > 0)
            log(level || 0, logger || console, <Op>this.stack.pop()).exec(this);

        this.running = false;

    }

}

/**
 * NullSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export class NullSystem implements System {

    state: State<ActorFrame> = new State({ $: nullFrame(this) }, {});

    configuration = {};

    init(): Initializer {

        return [undefined, undefined];

    }

    accept({ to, from, message }: Envelope): NullSystem {

        return this.exec(new Drop(to, from, message));

    }

    stop(): void {

        throw new Error('The system has been stopped!');

    }

    allocate(t: Template): ActorFrame {

        return new ActorFrame(nothing(), this, [], flagDefaults({}), t);

    }

    spawn(_: Template): NullSystem {

        return this;

    }

    identify(_: Actor): Address {

        return ADDRESS_DISCARD;

    }

    exec(_: Op): NullSystem {

        return this;

    }

    run(): void { }

}

const flagDefaults = (f: { [key: string]: boolean }) =>
    merge({ buffered: true, immutable: true }, f);

const nullFrame = (s: System) =>
    new ActorFrame(nothing(), s, [], flagDefaults({}), new SysT());
