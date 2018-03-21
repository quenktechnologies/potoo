import * as Promise from 'bluebird';
import * as event from '../../lib/system/log/event';
import { Actor, Address, Template } from '../../lib/actor';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '../../lib/system';

/**
 * MockSystem
 */
export class MockSystem implements System {

    toAddress(_: Actor): Maybe<string> {

        return Maybe.fromString('?');

    }

    putMessage(_: Envelope): MockSystem {

        return this;

    }

    askMessage(_: Envelope, __ = Infinity): Promise<undefined> {

        return Promise.resolve(undefined);

    }

    removeActor(_: Actor, __: string): MockSystem {

        return this;

    }

    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(_parent: Actor, _: Template): Address {

        return '?';

    }

    discard(_: Envelope): MockSystem {

        return this;

    }

    putActor(_path: string, _actor: Actor): MockSystem {

        return this;

    }

    putError(_: Actor, __: Error): MockSystem {

        return this;

    }

    log(_: event.Event): MockSystem {

        return this;

    }

}
