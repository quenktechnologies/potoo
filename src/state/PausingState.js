import Promise from 'bluebird';
import RefState from './RefState';
import Signal from './Signal';
import PausedState from './PausedState';
import Ticker from './Ticker';

/**
 * PausingState
 */
class PausingState extends RefState {

    signal() {

        return Signal.Pausing;

    }

    sync() {

        this._countdown = new Ticker(
            this._context.children().length,
            (message, from) => (message === Signal.Paused) && (this._context.isChild(from)),
            (message, from) => this._context.system().deadLetters().tell(message, from),
            () => this._context.dispatcher().executeOnPause());

        this._context.children().forEach(child => child.self().tell(Signal.Pause, this._context.self()));

    }

    tell(message, from) {

        this._countdown.tick(message, from);

    }

}

export default PausingState
