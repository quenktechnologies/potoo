import Promise from 'bluebird';
import RefState from './RefState';
import RunningState from './RunningState';
import Signal from './Signal';
import Ticker from './Ticker';

/**
 * ResumingState
 */
class ResumingState extends RefState {

    signal() {

        return Signal.Resuming;

    }

    sync() {

        this._countdown = new Ticker(
            this._context.children().length,
            (message, from) => (message === Signal.Resumed) && (this._context.isChild(from)),
            (message, from) => this._context.system().deadLetters().tell(message, from),
            () => this._context.dispatcher().execute(
                concern => concern.onResume(),
                () => this._context.self().setState(new RunningState(this._context))));

        this._context.children().
        forEach(child =>
            child.self().tell(Signal.Resume, this._context.self()));

    }

    tell(message, from) {

        this._countdown.tick(message, from);

    }

    ask(message, from) {

        this.tell(message, from);
        return Promise.resolve();

    }

}

export default ResumingState
