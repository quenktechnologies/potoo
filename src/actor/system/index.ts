import * as address from '../address';
import * as config from './configuration';
import { Err } from '@quenk/noni/lib/control/error';
import { ADDRESS_DISCARD, Address } from '../address';
import { Template } from '../template';
import { Actor } from '../';
import { Spawn } from './op/spawn';
import { Drop } from './op/drop';
import { Op, log } from './op';
import { Envelope } from '../mailbox';
import { Context, newContext } from '../context';
import { State, getAddress } from './state';
import { Executor } from './op';

/**
 * System represents a dynamic collection of actors that 
 * share the JS event loop.
 */
export interface System<C extends Context> extends Actor<C> {

    /**
     * identify an actor instance.
     *
     * If the actor is unknown the ADDRESS_DISCARD should be returned.
     */
    identify(a: Actor<C>): Address;

    /**
     * exec queses up an Op to be executed by the System.
     */
    exec(code: Op<C>): System<C>;

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
export class ActorSystem implements System<Context>, Executor<Context> {

    constructor(
        public stack: Op<Context>[],
        public configuration: config.Configuration = {}) { }

    state: State<Context> = {

        contexts: {

            $: newContext(this, new SysT())

        },

        routes: {}

    };

    running: boolean = false;

    init(c: Context): Context {

        return c;

    }

    exec(code: Op<Context>): ActorSystem {

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

    allocate(t: Template<Context>): Context {

        let act = t.create(this);
        return act.init(newContext(act, t));

    }

    spawn(t: Template<Context>): ActorSystem {

        this.exec(new Spawn(this, t));
        return this;

    }

    identify(actor: Actor<Context>): Address {

        return getAddress(this.state, actor)
            .orJust(() => ADDRESS_DISCARD)
            .get();

    }

    run(): void {

      let policy = <config.LogPolicy>(this.configuration.log||{});

        if (this.running) return;

        this.running = true;

        while (this.stack.length > 0)
      log(policy.level || 0, policy.logger || console,
        <Op<Context>>this.stack.pop()).exec(this);

        this.running = false;

    }

}

/**
 * NullSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export class NullSystem<C extends Context> implements System<C> {

    init(c: C): C {

        return c;

    }

    accept(_: Envelope): NullSystem<C> {

        return this;

    }

    stop(): void {

        throw new Error('The system has been stopped!');

    }

    identify(_: Actor<Context>): Address {

        return ADDRESS_DISCARD;

    }

    exec(_: Op<C>): NullSystem<C> {

        return this;

    }

    run(): void { }

}
