import beof from 'beof';
import Promise from 'bluebird';
import RefState from './state/RefState';
import Signal from './state/Signal';
import Reference from './Reference';
import RunningState from './state/RunningState';

/**
 * LocalReference acts is the Reference implementation for Concerns residing
 * in local address space.
 * via the LocalReference.
 * @param {ChildContext} context
 * @implements {LocalReference}
 */
class LocalReference {

    constructor(context) {

        this._state = new RunningState(context);
        this._watchers = [context.parent().self()];

    }

    /**
     * setState changes the state of this Reference, this
     * meant to be used internally.
     * @param {RefState} state
     */
    setState(state) {

        beof({ state }).instance(RefState);

        var notify = state !== this._state;

        this._state = state;
        this._state.sync();

        if (notify)
            this._watchers.forEach(w => w.tell(this._state.signal(), this));

    }

    path() {

        return this._state.path();

    }

    watch(ref) {

        beof({ ref }).interface(Reference);

        this._watchers.push(ref);
        return this;

    }

    unwatch(ref) {

        beof({ ref }).interface(Reference);

        this._watchers = this._watchers.filter(o => (ref === o) ? false : true);
        return this;

    }

    tell(message, from) {

        beof({ from }).optional().interface(Reference);

        if (message === Signal.Restart)
            this.setState(this._state.restart());
        else if (message === Signal.Pause)
            this.setState(this._state.pause());
        else if (message === Signal.Stop)
            this.setState(this._state.stop());
        else if (message === Signal.Resume)
            this.setState(this._state.resume());
         else
            this._state.tell(message, from);



    }

}

export default LocalReference
