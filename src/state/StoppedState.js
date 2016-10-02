import RefState from './RefState';
import Signal from './Signal';
import RestartingState from './RestartingState';

/**
 * StoppedState means the Concern is stopped and will process no
 * more messages.
 */
class StoppedState extends RefState {

    signal() {

        return Signal.Stopped;

    }

    restart() {

        return new RestartingState(this._context);

    }

}

export default StoppedState
