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
export declare abstract class TestAbstractSystem extends AbstractSystem {
    configuration: config.Configuration;
    constructor(configuration?: config.Configuration);
    MOCK: Data;
    exec(i: Instance, s: Script): Maybe<Value>;
    ident(i: Instance): Address;
    init(c: Context): Context;
    accept(m: Message): void;
    stop(): void;
    run(): void;
}
