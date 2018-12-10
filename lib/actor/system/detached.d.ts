import { Address } from '../address';
import { Actor } from '../';
import { Envelope } from '../mailbox';
import { Context } from '../context';
import { Op } from './op';
import { System } from './';
/**
 * DetachedSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export declare class DetachedSystem<C extends Context> implements System<C> {
    init(c: C): C;
    accept(_: Envelope): DetachedSystem<C>;
    stop(): void;
    identify(_: Actor<Context>): Address;
    exec(_: Op<C, DetachedSystem<C>>): DetachedSystem<C>;
    run(): void;
}
