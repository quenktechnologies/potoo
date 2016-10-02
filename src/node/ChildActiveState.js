import RefState from '../RefState';

/**
 * ChildActiveState represents the Active state of a child processes's Concern
 */
class ChildActiveState extends RefState.Active {

    constructor(child, path, remotePath, concern, context, provider) {

        super(path, concern, context, provider);
        this._child = child;
        this._remotePath = remotePath;

    }

    action(msg, sender, ref) {

        this._child.send(RemoteMessage.asString(this.remotePath, msg, sender));

    }

}
export default ChildActiveState
