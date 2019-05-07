import * as config from '../configuration';
import { Err } from '@quenk/noni/lib/control/error';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { This } from '../vm/runtime/this';
import { Value, Script } from '../vm/script';
import { Runtime } from '../vm/runtime';
import { Platform } from '../vm';
import { ADDRESS_SYSTEM, ADDRESS_DISCARD, Address } from '../../address';
import { Template as ActorTemplate } from '../../template';
import { Context } from '../../context';
import { Template } from '../../template';
import { Message } from '../../message';
import { State, getAddress, getRuntime } from '../state';
import { Actor, Instance } from '../../';
import { System } from '../';
import { SpawnScript } from './scripts';

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
 * AbstractSystem can be extended to create a customized actor system.
 */
export abstract class AbstractSystem<C extends Context>
    implements System<C>, Platform {

    constructor(public configuration: config.Configuration = {}) { }

    abstract state: State<C>;

    abstract allocate(
        a: Actor<C>,
        h: Runtime,
        t: Template<C, AbstractSystem<C>>): C

    ident(i: Instance): Address {

        return getAddress(this.state, i).orJust(() => ADDRESS_DISCARD).get();

    }

    /**
     * spawn a new actor from a template.
     */
    spawn(t: ActorTemplate<C, AbstractSystem<C>>): AbstractSystem<C> {

        (new This('$', this)).exec(new SpawnScript('', t));

        return this;

    }

    init(c: C): C {

        return c;

    }

    notify(): void {

    }

    accept(_: Message): void {


    }

    stop(): void {

    }

    run(): void {

    }

    exec(i: Instance, s: Script): Maybe<Value> {

        return getRuntime(this.state, i)
            .chain(r => r.exec(<Script>s));

    }

}

/**
 * newContext produces the bare minimum needed for creating a Context type.
 *
 * The value can be merged to satsify user defined Context types.
 */
export const newContext = <C extends Context, S extends System<C>>
    (actor: Instance,
        runtime: Runtime,
        template: ActorTemplate<C, S>): Context => ({

            mailbox: nothing(),

            actor,

            behaviour: [],

            flags: { immutable: false, buffered: false },

            runtime,

            template

        });

/**
 * newState produces the bare minimum needed for creating a State.
 *
 * The value can be merged to statisfy user defined State.
 */
export const newState = <C extends Context>(sys: Platform): State<C> => ({

    contexts: {

        $: sys.allocate(sys, new This('$', sys), new STemplate())

    },

    routers: {},

    groups: {}

});
