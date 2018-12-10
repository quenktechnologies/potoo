import * as config from './actor/system/configuration';
import * as address from './actor/address';
import { Err } from '@quenk/noni/lib/control/error';
import { rmerge } from '@quenk/noni/lib/data/record';
import { nothing } from '@quenk/noni/lib/data/maybe';
import { Spawn } from './actor/system/op/spawn';
import { Discard } from './actor/system/op/discard';
import { State } from './actor/system/state';
import { Envelope } from './actor/mailbox';
import { Context } from './actor/context';
import { Template } from './actor/template';
import {Instance} from './actor';
import { AbstractSystem } from './actor/system';

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
export class ActorSystem extends AbstractSystem<Context> {

    state: State<Context> = {

        contexts: {

            $: newContext(this, new SysT())

        },

        routes: {}

    };

    running: boolean = false;

    accept({ to, from, message }: Envelope): ActorSystem {

        return <ActorSystem>this.exec(new Discard(to, from, message));

    }

    allocate(t: Template<Context, ActorSystem>): Context {

        let act = t.create(this);
        return act.init(newContext(act, t));

    }

    /**
     * spawn a new actor from a template.
     */
    spawn(t: Template<Context,ActorSystem>): ActorSystem {

        this.exec(new Spawn(this, t));
        return this;

    }

}

/**
 * system creates a new actor system using the optionally passed
 * configuration.
 */
export const system = (conf: config.Configuration): ActorSystem =>
    new ActorSystem(rmerge(config.defaults(), conf));

const newContext =
    (actor: Instance, template: Template<Context,ActorSystem>): Context => ({

        mailbox: nothing(),

        actor,

        behaviour: [],

        flags: { immutable: false, buffered: false },

        template

    });
