import beof from 'beof';
import RefState from '../RefState';
import RemoteTerminatedError from '../RemoteTerminatedError';
import Signal from '../Signal';

/**
 * ChildStateProvider provides the states for a Concern in a child process.
 * @param {string} remotePath - The path the remote System will recognise.
 * @param {string} localPath  - The path we used locally to refer to the Concern.
 * @param {ChildProcess} child
 * @implements {StateProvider}
 */
class ChildStateProvider {

    constructor(localPath, remotePath, child) {

        this._child = child;
        this._localPath = localPath;
        this._remotePath = remotePath;
        this._ref = null;

    }

    provide(state, concern, context) {

        var SignalConstructor;

        switch (state) {

            case RefState.ACTIVE_STATE:
                SignalConstructor = Signal.Start;
                break;

            case RefState.PAUSED_STATE:
                SignalConstructor = Signal.Pause;
                break;

            case RefState.STOPPED_STATE:
                SignalConstructor = Signal.Stop;
                break;

            default:
                throw new ReferenceError(`Invalid state: '${state}'!`);

        }

        try {

            this._child.send(new SignalConstructor(this._remotePath));

        } catch (e) {

            context.publish(new RemoteTerminatedError(e));
            return new RefState.Stopped(this._localPath, concern, context, this);

        }

        return (SignalConstructor === Signal.Stop) ?
            new RefState.Stopped(this._localPath, concern, context, this) :
            new RefState.Paused(this._localPath, concern, context, this);

    }

}

export default ChildStateProvider
