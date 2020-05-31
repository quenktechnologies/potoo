import * as config from '../configuration';
import { Data } from '@quenk/test/lib/mock';
import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Address } from '../../address';
import { Instance } from '../../';
import { Value, Script } from '../vm/script';
import { Message } from '../../message';
import { Context } from '../../context';
import { AbstractSystem } from './';

/**
 * TestAbstractSystem
 *  
 * This system is provided for testing purposes. It provdies all the features
 * of the AbstractSystem.
 */
export abstract class TestAbstractSystem extends AbstractSystem {

    constructor(public configuration: config.Configuration = {}) {

        super();

    }

    MOCK = new Data();

    exec(i: Instance, s: Script): Maybe<Value> {

        this.MOCK.record('exec', [i, s], this);
        return super.exec(i, <Script>s);

    }

    ident(i: Instance): Address {

        return this.MOCK.record('ident', [i], super.ident(i));

    }

    init(c: Context): Context {

        return this.MOCK.record('init', [c], super.init(c));

    }

    accept(m: Message): void {

        return this.MOCK.record('accept', [m], super.accept(m));

    }

    stop(): void {

        return this.MOCK.record('stop', [], super.stop());

    }

    run(): void {

        return this.MOCK.record('run', [], super.run());

    }

}