import Promise from 'bluebird';
import RefState from './RefState';
import Signal from './Signal';
import StoppedState from './StoppedState';
import Ticker from './Ticker';

/**
 * StoppingState
 */
class StoppingState extends RefState {

    signal() {

        return Signal.Stopping;

    }

    sync() {

        this._countdown = new Ticker(
            this._context.children().length,
            (message, from) => (message === Signal.Stopped) && (this._context.isChild(from)),
            (message, from) => this._context.system().deadLetters().tell(message, from),
            () => this._context.dispatcher().execute(
                concern => concern.onStop(),
                () => this._context.self().setState(new StoppedState(this._context))));

        this._context.children().
        forEach(child =>
            child.self().tell(Signal.Stop, this._context.self()));

    }

    tell(message, from) {

        this._countdown.tick(message, from);

    }

}

export default StoppingState
