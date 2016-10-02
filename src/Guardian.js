import beof from 'beof';
import AppConcern from './AppConcern';
import ConcernFactory from './ConcernFactory';
import ChildContext from './ChildContext';
import NullReference from './NullReference';
import Defaults from './Defaults';
import DeadLetters from './DeadLetters';

/**
 * Guardian
 */
class Guardian {

    constructor(system) {

        this.deadLetters = new DeadLetters(system);
        this.sys = new ChildContext('/sys', this, new Defaults(context => new AppConcern()), system);
        this.app = new ChildContext('/app', this, new Defaults(context => new AppConcern()), system);

    }

    path() {

        return '/';

    }

    self() {

        return this;

    }

    parent() {

        return null;

    }

    isChild(ref) {

        return ([this.app.self(), this.sys.self()].indexOf(ref) > -1);

    }

    children() {

        return [this.app.self(), this.sys.self()];

    }

    mailbox() {

        return this;

    }

    dispatcher() {

        return this;

    }

    watch(ref) {

        throw new ReferenceError('watch(): is not implemented!');

    }

    unwatch(ref) {

        throw new ReferenceError('unwatch(): is not implemented!');

    }

    tell(message, from) {

        this.deadLetters.tell(message, from);

    }

    select(path) {

        return new NullReference(path, this.deadLetters);

    }

    concernOf(factory, name) {

        throw new ReferenceError('concernOf(): is not implemented!');

    }

    system() {

        return this._system;

    }

    enqueue(msg) {

        throw new TypeError('Cannot enqueue to \'/\'');

    }

    dequeue() {

        throw new TypeError('Cannot dequeue \'/\'');

    }

    executeChildError(e, child) {

        throw e;

    }

    executeOnReceive() {

        throw new ReferenceError('executeOnReceive(): is not implemented!');

    }

    executeOnStart() {

        throw new ReferenceError('executeOnStart(): is not implemented!');

    }

    executeOnPause() {

        throw new ReferenceError('executeOnPause(): is not implemented!');

    }

    executeOnResume() {

        throw new ReferenceError('executeOnResume(): is not implemented!');

    }

    executeOnRestart() {

        throw new ReferenceError('executeOnRestart(): is not implemented!');

    }

    executeOnStop() {

        throw new ReferenceError('executeOnStop(): is not implemented!');

    }

}

export default Guardian
