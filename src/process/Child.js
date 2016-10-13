import child_process from 'child_process';
import beof from 'beof';
import Promise from 'bluebird';
import Signal from '../state/Signal';
import Address from '../Address';

/**
 * Child is the peer to use for running another System as a child process.
 * It will take care of forking the the child and transfering messages between the two
 * systems.
 * @param {string} path - The absolute path to the file to execute.
 * @implements {Peer}
 */
class Child {

    constructor(path) {

        beof({ path }).string();

        this._path = path;
        this._child = null;

    }

    unresolve(path) {

        var addr = Address.fromString(path);

        if (!addr.isRemote())
            return path;

        return addr.uri.hash.split('#')[1];

    }

    resolve(path) {

        var addr = Address.fromString(path);

        if (addr.isRemote())
            return path;


        return `child://${this._path}#${path}`;

    }

    handles(address) {

        if (address.uri.protocol === 'child:')
            if (address.uri.pathname === this._path)
                return true;

    }

    associate(remote) {

        this._monitor = remote;

        return Promise.try(() => {
            this._child = child_process.fork(this._path);
            this._child.on('message', message => remote.message(message));
            this._child.on('error', e => remote.error(e));
            this._child.on('exit', e => remote.closed(Signal.Closed));
        });

    }

    send(message) {

        Promise.try(() => this._child.send(message)).
        catch(e => this._monitor.error(e));

    }

}

export default Child
