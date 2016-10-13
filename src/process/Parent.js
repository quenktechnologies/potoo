import Promise from 'bluebird';
import Address from '../Address';

/**
 * Parent allows a child process to communicate with a peered System.
 * @implements {Peer}
 */
class Parent {

    resolve(path) {

        var addr = Address.fromString(path);

        if(addr.isRemote())
            return path;

        return `parent://${path}`;

    }

    unresolve(path) {

        var addr = Address.fromString(path);

        if (!addr.isRemote())
            return path;

        return addr.uri.pathname;

    }

    handles(address) {

        if (address.uri.protocol === 'parent:')
            return true;

    }

    associate(remote) {

        this._monitor = remote;
        process.on('message', message => remote.message(message));
        return Promise.resolve();

    }

    send(message) {

        Promise.try(() => process.send(message)).
        catch(e => this._monitor.error(e));
    }

}

export default Parent
