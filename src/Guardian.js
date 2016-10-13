import beof from 'beof';
import Address from './Address';
import AppConcern from './AppConcern';
import ConcernFactory from './ConcernFactory';
import ChildContext from './ChildContext';
import NullReference from './NullReference';
import Defaults from './Defaults';
import DeadLetters from './DeadLetters';
import Monitor from './remote/Monitor';
import Peer from './remote/Peer';
import RemoteReference from './remote/RemoteReference';

/**
 * Guardian
 */
class Guardian {

    constructor(system) {

        this.deadLetters = new DeadLetters(system);
        this.app = new ChildContext('/app', this, new Defaults(context => new AppConcern(context)), system);
        this.peers = [];
        this._system = system;

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

        var addr = Address.fromString(path);
        var peer = null;

        if (addr.isRemote()) {

            this.peers.forEach(p => {

                if (p.handles(addr))
                    peer = p;

            });

        }

        if (peer !== null)
            return new RemoteReference(path, peer);

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

    peer(instance, config) {

        beof({ instance }).interface(Peer);
        beof({ config }).optional().object();

        var monitor = new Monitor(instance, this._system, config);

        monitor.associate();
        this.peers.push(instance);

    }


}

export default Guardian
