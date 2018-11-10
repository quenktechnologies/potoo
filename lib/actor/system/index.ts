import * as config from './configuration';
import { ADDRESS_DISCARD, Address } from '../address';
import { Template } from '../template';
import { Actor } from '../';
import { Drop } from './op/drop';
import { Op, log } from './op';
import { Envelope } from '../mailbox';
import { Context } from '../context';
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
 * AbstractSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export abstract class AbstractSystem<C extends Context>
    implements System<C>, Executor<C> {

    constructor(public configuration: config.Configuration = {}) { }

    stack: Op<C>[] = [];

    running: boolean = false;

    abstract state: State<C>;

    exec(code: Op<C>): AbstractSystem<C> {

        this.stack.push(code);
        this.run();
        return this;

    }

    abstract allocate(t: Template<C>): C;

    identify(actor: Actor<Context>): Address {

        return getAddress(this.state, actor)
            .orJust(() => ADDRESS_DISCARD)
            .get();

    }

    init(c: C): C {

        return c;

    }

    accept({ to, from, message }: Envelope): AbstractSystem<C> {

        return this.exec(new Drop(to, from, message));

    }

    stop(): void { }

    run(): void {

        let policy = <config.LogPolicy>(this.configuration.log || {});

        if (this.running) return;

        this.running = true;

        while (this.stack.length > 0)
            log(policy.level || 0, policy.logger || console,
                <Op<C>>this.stack.pop()).exec(this);

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
