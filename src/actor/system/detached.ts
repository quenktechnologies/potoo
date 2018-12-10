import { ADDRESS_DISCARD, Address } from '../address';
import { Actor } from '../';
import { Envelope } from '../mailbox';
import { Context } from '../context';
import {Op} from './op';
import {System} from './';

/**
 * DetachedSystem is used by stopped actors to avoid side-effect caused
 * communication.
 */
export class DetachedSystem<C extends Context> implements System<C> {

    init(c: C): C {

        return c;

    }

    accept(_: Envelope): DetachedSystem<C> {

        return this;

    }

    stop(): void {

        throw new Error('The system has been stopped!');

    }

    identify(_: Actor<Context>): Address {

        return ADDRESS_DISCARD;

    }

  exec(_: Op<C, DetachedSystem<C>>): DetachedSystem<C> {

        return this;

    }

    run(): void { }

}
