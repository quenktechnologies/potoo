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
export declare abstract class TestAbstractSystem<C extends Context> extends AbstractSystem<C> {
    configuration: config.Configuration;
    constructor(configuration?: config.Configuration);
    MOCK: Data;
    abstract allocate(t: Template<C, TestAbstractSystem<C>>): C;
    exec(code: Op<C, TestAbstractSystem<C>>): TestAbstractSystem<C>;
    identify(actor: Actor<Context>): Address;
    init(c: C): C;
    accept(e: Envelope): TestAbstractSystem<C>;
    stop(): void;
    run(): void;
}
