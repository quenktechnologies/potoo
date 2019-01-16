import * as config from '../configuration';
import { ADDRESS_DISCARD, Address } from '../../address';
import { Template } from '../../template';
import { Actor } from '../../';
import { Discard } from '../op/discard';
import { Op, log } from '../op';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { State, getAddress } from '../state';
import { Executor } from '../op';
import {System} from '../';

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

    exec(code: Op<C, AbstractSystem<C>>): AbstractSystem<C> {

        this.stack.push(code);
        this.run();
        return this;

    }

    abstract allocate(t: Template<C, AbstractSystem<C>>): C;

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
