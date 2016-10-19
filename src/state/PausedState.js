import Promise from 'bluebird';
import RefState from './RefState';
import Signal from './Signal';
import RestartingState from './RestartingState';
import ResumingState from './ResumingState';
import StoppingState from './StoppingState';

/**
 * PausedState
 */
class PausedState extends RefState {

    signal() {

        return Signal.Paused;

    }

    restart() {

        return new RestartingState(this._context);

    }

    stop() {

        return new StoppingState(this._context);

    }

    resume() {

        return new ResumingState(this._context);

    }

    tell(message, from) {

        this._context.mailbox().enqueue({ message, from });

    }

    ask(message, from) {

        this.tell(message, from);
        return Promise.resolve();

    }

}

export default PausedState
