import assert from 'assert';
import RefState from '../RefState';
import Reference from '../Reference';
import RemoteMessage from '../RemoteMessage';
import InvalidMessageError from '../InvalidMessageError';
import ChildActiveState from './ChildActiveState';

/**
 * ChildReference
 */
class ChildReference extends Reference {

    constructor(state, path, remotePath, concern, context, provider, child) {

        super(state);

        //look out for messages from the child process
        child.on('message', message => {

            var m;

            try {
                m = JSON.parse(message);
                assert.ok(typeof m === 'object');
            } catch (e) {
                return context.publish(new InvalidMessageError(message, path));
            }

            if (RefState.equals(m, RefState.Active))
                this._state = new ChildActiveState(child, path, remotePath, concern, context, provider);

            else if (RefState.equals(m, RefState.Paused))
                this._state = new RefState.Paused(path, concern, context, provider);

            else if (RefState.equals(m, RefState.Stopped))
                this._state = new RefState.Stopped(path, concern, context, provider);

            else if (RemoteMessage.is(m))
                context.select(m.to).accept(m.body, this);

        });

    }

}

export default ChildReference
