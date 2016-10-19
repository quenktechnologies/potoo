import beof from 'beof';
import Promise from 'bluebird';
import Context from '../Context';
import Reference from '../Reference';

/**
 * RefState is really a Concern's state but because we abstract away the
 * state management to the Reference implementation subclasses of this class
 * refer to the state the Reference is in.
 * @param {Context} context
 * @param {Reference} ref
 * @abstract
 * @implements {LocalReference}
 */
class RefState {

    constructor(context) {

        beof({ context }).interface(Context);

        this._context = context;

    }

    static equals(o, state) {

        //example
        //{
        // type: 'state',
        // state: 'Active',
        // path: '/lib/tasks/generate_events.js#/main/posts/comments',
        //}
        if (typeof o === 'object')
            if (o.type === 'state')
                if (typeof o.path === 'string')
                    if (o.state === state.name)
                        return true;

    }

    path() {

        return this._context.path();

    }

    watch() {

    }

    unwatch() {


    }

    tell(message, from) {

        beof({ from }).interface(Reference);

        this._context.system().deadLetters().tell(message, from);

    }

    ask(message, from) {

        this.tell(message, from);
        return Promise.resolve();

    }

    /**
     * stop
     * @param {Reference} ref
     * @returns {RefState}
     */
    stop() {

        return this;

    }

    /**
     * restart
     * @param {Reference} ref
     * @returns {RefState}
     */
    restart() {

        return this;

    }

    /**
     * pause
     * @param {Reference} ref
     * @returns {RefState}
     */
    pause() {

        return this;

    }

    /**
     * resume
     * @param {Reference} ref
     * @returns {RefState}
     */
    resume() {

        return this;

    }

    /**
     * sync is called to synchronize the RefState
     */
    sync() {

    }

    toString() {

        return JSON.stringify({
            type: 'state',
            state: this.constructor.name,
            path: this.path()
        });

    }

}

export default RefState
