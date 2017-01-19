import beof from 'beof';
import Promise from 'bluebird';
import ChildContext from './ChildContext';
import System from './System';
import DroppedMessage from './dispatch/DroppedMessage';
import { escalate } from './dispatch/strategy';

/**
 * Guardian
 * @implements {Context}
 * @implements {Reference}
 * @implements {Mailbox}
 * @implements {Dispatcher}
 */
export class Guardian {

    constructor(system) {

        beof({ system }).interface(System);

        this._system = system;
        this.tree = new ChildContext('/', this, this, { strategy: escalate, dispatch: this });

    }

    path() {

        return '/';

    }

    self() {

        return this;

    }

    parent() {

        return this;

    }

    root() {

        return this;

    }

    none() {

        return this.self();

    }

    select(path) {

        return { tell: m => this.tell(new DroppedMessage({ message: m, to: path })) };

    }

    spawn(spec, name) {

        return this.tree.spawn(spec, name);

    }

    receive(cb) {

        return Promise.try(() => cb(null));

    }

    tell(message) {

        if (message instanceof Error)
            throw message;

        this._system.publish(message);

    }

}

export default Guardian
