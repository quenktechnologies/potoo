import Signal from '../state/Signal';
/**
 * RemoteReference is a handle to a remote Concern that we communicate
 * with via some transport mechanisim.
 * @param {string} path
 * @param {Transport} transport
 */
class RemoteReference {

    constructor(path, transport) {

        this._path = path;
        this._transport = transport;

    }

    path() {

        return this._transport.resolve(this._path);

    }

    watch() {

        throw new ReferenceError('RemoteReference#watch is not implemented yet!');

    }

    unwatch() {

        throw new ReferenceError('RemoteReference#unwatch is not implemented yet!');

    }

    tell(message, from) {

       var namespace = (message instanceof Signal) ? 'system' : 'user';

        this._transport.send({
            namespace,
            to: this._transport.unresolve(this._path),
            from: from,
            body: message
        });

    }

    toJSON() {

        return this.toString();

    }

    toString() {

        return this.path();

    }

}

export default RemoteReference
