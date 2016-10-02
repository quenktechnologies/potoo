import ChildProcess from 'child_process';
import beof from 'beof';
import Address from '../Address';
import RefState from '../RefState';
import Concern from '../Concern';
import ChildStateProvider from './ChildStateProvider';
import ChildReference from './ChildReference';
import SpawnChildProcessError from './SpawnChildProcessError';
import StateProvider from '../StateProvider';

/**
 * ChildReferenceProvider provides a Reference for a Concern
 * running on a child process.
 * @implements {ReferenceProvider}
 */
class ChildReferenceProvider {

    constructor() {

        this._cache = {};
        this._list = {};

    }

    /**
     * getProcessList returns a map of child process
     * created by this provider.
     * @return {object}
     */
    getProcessList() {

        return this._list;

    }

    select(path, context) {

        var addr = Address.fromString(path);
        var concern = new Concern();
        var child;
        var provider;

        if (this._cache.hasOwnProperty(path))
            return this._cache[path];

        //@todo move to validator class
        if (typeof addr.uri.hash !== 'string')
            throw new ReferenceError('A child process uri must have a path and hash part!');

        if (this._list.hasOwnProperty(addr.uri.path)) {

            child = this._list[addr.uri.path];

        } else {

            try {

                child = ChildProcess.fork(addr.uri.path);
                this._list[addr.uri.path] = child;

            } catch (e) {

                context.publish(new SpawnChildProcessError(e));

                return new Reference(new RefState.UnknownState(
                    path, concern, context, new StateProvider()));

            }
        }

        provider = new ChildStateProvider(path, addr.uri.hash.substring(1), child);

        return this._cache[path] = new ChildReference(
            provider.provide(RefState.ACTIVE_STATE, concern, context),
            path, addr.uri.hash.substring(1), concern, context, provider, child);

    }

    reselect(path, context) {

        this._cache[path] = null;
        return this.select(path, context);

    }

}

export default ChildReferenceProvider
