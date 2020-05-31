import * as config from '../configuration';
import { Mock } from '@quenk/test/lib/mock';
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

    MOCK = new Mock();

    exec(i: Instance, s: Script): Maybe<Value> {

        this.MOCK.invoke('exec', [i, s], this);
        return super.exec(i, <Script>s);

    }

    ident(i: Instance): Address {

        return this.MOCK.invoke('ident', [i], super.ident(i));

    }

    init(c: Context): Context {

        return this.MOCK.invoke('init', [c], super.init(c));

    }

    accept(m: Message): void {

        return this.MOCK.invoke('accept', [m], <undefined>super.accept(m));

    }

    stop(): void {

        return this.MOCK.invoke('stop', [], <undefined>super.stop());

    }

    run(): void {

        return this.MOCK.invoke('run', [], <undefined>super.run());

    }

}
