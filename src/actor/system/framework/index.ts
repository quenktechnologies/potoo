import * as config from '../configuration';
import { Err } from '@quenk/noni/lib/control/error';
import { nothing } from '@quenk/noni/lib/data/maybe';
import { ADDRESS_SYSTEM } from '../../address';
import { Template as ActorTemplate } from '../../template';
import { Actor, Instance } from '../../';
import { Context } from '../../context';
import { Template } from '../../template';
import { State } from '../state';
import { Runtime } from '../vm/runtime';
import { System } from '../';
import { SpawnScript } from './scripts';
import { This } from '../vm/runtime/this';

/**
 * STemplate is provided here as a convenience when creating new systems.
 *
 * It provides the expected defaults.
 */
export class STemplate {

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
 * Implemnation of a System and Runtime that spawns
 * various general purpose actors.
 */
export abstract class AbstractSystem<C extends Context> implements System<C> {

    constructor(public configuration: config.Configuration = {}) { }

    abstract state: State<C>;

    abstract allocate(
        a: Actor<C>,
        h: Runtime<C, AbstractSystem<C>>,
        t: Template<C, AbstractSystem<C>>): C

    /**
     * spawn a new actor from a template.
     */
    spawn(t: ActorTemplate<C, AbstractSystem<C>>): AbstractSystem<C> {

        (new This('$', this)).exec(new SpawnScript('',t));

        return this;

    }

    init(c: C): C {

        return c;

    }

    notify() { }

    accept() {

        return this;

    }

    stop(): void { }

    run(): void { }

}

/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
export const newContext = <C extends Context, S extends System<C>>
    (actor: Instance, handler: Runtime<C, S>, template: ActorTemplate<C, S>)
    : Context => ({

        mailbox: nothing(),

        actor,

        behaviour: [],

        flags: { immutable: false, buffered: false },

        handler,

        template

    });

/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
export const newState = <C extends Context>(sys: System<C>): State<Context> => ({

    contexts: {

        $: newContext(sys, new This('$', sys), new STemplate())

    },

    routers: {}

});
