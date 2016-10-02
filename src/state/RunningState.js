import RefState from './RefState';
import Signal from './Signal';
import PausingState from './PausingState';
import RestartingState from './RestartingState';
import StoppingState from './StoppingState';

/**
 * RunningState
 */
class RunningState extends RefState {

    signal() {

        return Signal.Running;

    }

    pause() {

        return new PausingState(this._context);

    }

    restart() {

        return new RestartingState(this._context);

    }

    stop() {

        return new StoppingState(this._context);

    }

    tell(message, from) {

        this._context.mailbox().enqueue({ message, from });

    }

}

export default RunningState
