import Promise from 'bluebird';
import RefState from './RefState';
import Signal from './Signal';
import Ticker from './Ticker';
import RunningState from './RunningState';

/**
 * RestartingState
 */
class RestartingState extends RefState {

    signal() {

        return Signal.Restarting;

    }

    sync() {


        this._countdown = new Ticker(
            this._context.children().length,
            (message, from) => (message === Signal.Restarted) && (this._context.isChild(from)),
            (message, from) => this._context.system().deadLetters().tell(message, from),
            () => this._context.dispatcher().execute(
                concern => concern.onRestart(),
                () => this._context.self().setState(new RunningState(this._context))));

        this._context.children().
        forEach(child =>
            child.self().tell(Signal.Restart, this._context.self()));

    }

    tell(message, from) {

        this._countdown.tick(message, from);

    }

}

export default RestartingState
