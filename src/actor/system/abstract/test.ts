import * as config from '../configuration';
import { Data } from '@quenk/test/lib/mock';
import { Address } from '../../address';
import { Template } from '../../template';
import { Actor } from '../../';
import { Op } from '../op';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { AbstractSystem } from './';

/**
 * TestAbstractSystem
 *
 * This system is provided for testing purposes. It provdies all the features
 * of the AbstractSystem.
 */
export abstract class TestAbstractSystem<C extends Context>
  extends AbstractSystem<C> {

    constructor(public configuration: config.Configuration = {}) {

        super();

    }

    MOCK = new Data();

    abstract allocate(t: Template<C, TestAbstractSystem<C>>): C;

    exec(code: Op<C, TestAbstractSystem<C>>): TestAbstractSystem<C> {

        this.MOCK.record('exec', [code], this);
        super.exec(code);
        return this;

    }

    identify(actor: Actor<Context>): Address {

        return this.MOCK.record('identify', [actor], this.identify(actor));

    }

    init(c: C): C {

        return this.MOCK.record('init', [c], super.init(c));

    }

    accept(e: Envelope): TestAbstractSystem<C> {

        this.MOCK.record('accept', [e], this);
        super.accept(e);
        return this;

    }

    stop(): void {

        return this.MOCK.record('stop', [], super.stop());

    }

    run(): void {

        return this.MOCK.record('run', [], super.run());

    }

}
