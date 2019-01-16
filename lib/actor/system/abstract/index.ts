import * as config from '../configuration';
import { Err } from '@quenk/noni/lib/control/error';
import { nothing } from '@quenk/noni/lib/data/maybe';
import { ADDRESS_DISCARD, ADDRESS_SYSTEM, Address } from '../../address';
import { Template as ActorTemplate } from '../../template';
import { Actor, Instance } from '../../';
import { Discard } from '../op/discard';
import { Op, log } from '../op';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { State, getAddress } from '../state';
import { Spawn } from '../op/spawn';
import { Executor } from '../op';
import { System } from '../';

/**
 * Template is provided here as a convenience when creating new systems.
 *
 * It provides the expected defaults.
 */
export class Template {

    public id = ADDRESS_SYSTEM;

    public create = () => {

        throw new Error('Cannot spawn a system actor!');

    }

    public trap = (e: Err) => {

        if (e instanceof Error) {

            throw e;

        } else {

            throw new Error(e.message);

        }

    }

}

/**
 * AbstractSystem
 *
 * Implemnation of a System and Executor that spawns
 * various general purpose actors.
 */
export abstract class AbstractSystem<C extends Context>
    implements System<C>, Executor<C, System<C>> {

    constructor(public configuration: config.Configuration = {}) { }

    stack: Op<C, System<C>>[] = [];

    running: boolean = false;

    abstract state: State<C>;

    abstract allocate(t: ActorTemplate<C, AbstractSystem<C>>): C;

    exec(code: Op<C, AbstractSystem<C>>): AbstractSystem<C> {

        this.stack.push(code);
        this.run();
        return this;

    }

    /**
     * spawn a new actor from a template.
     */
      spawn(t: ActorTemplate<C, AbstractSystem<C>>): AbstractSystem<C> {

        this.exec(new Spawn(this, t));
        return this;

    }

    identify(actor: Actor<Context>): Address {

        return getAddress(this.state, actor)
            .orJust(() => ADDRESS_DISCARD)
            .get();

    }

    init(c: C): C {

        return c;

    }

    accept({ to, from, message }: Envelope): AbstractSystem<C> {

        return this.exec(new Discard(to, from, message));

    }

    stop(): void { }

    run(): void {

        let policy = <config.LogPolicy>(this.configuration.log || {});

        if (this.running) return;

        this.running = true;

        while (this.stack.length > 0)
            log(policy.level || 0, policy.logger || console,
                <Op<C, System<C>>>this.stack.pop()).exec(this);

        this.running = false;

    }

}

/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
export const newContext = <C extends Context, S extends System<C>>
    (actor: Instance, template: ActorTemplate<C, S>): Context => ({

        mailbox: nothing(),

        actor,

        behaviour: [],

        flags: { immutable: false, buffered: false },

        template

    });

/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
export const newState = <C extends Context>(sys: System<C>): State<Context> => ({

    contexts: {

        $: newContext(sys, new Template())

    },

    routes: {}

});
