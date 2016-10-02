import events from 'events';
import Promise from 'bluebird';
import beof from 'beof';
import Guardian from './Guardian';

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the root of a tree your application will
 * branch into.
 * @param {Context} parent
 * @implements {Context}
 */
class IsomorphicSystem {

    constructor() {

        this._events = new events.EventEmitter();
        this._root = new Guardian(this);

    }

    /**
     * create a new IsomorphicSystem
     * @param {string} name
     * @returns {IsomorphicSystem}
     */
    static create(name) {

        return new IsomorhpicSystem();

    }

    deadLetters() {

        return this._root.deadLetters;

    }

    select(path) {

        return this._root.app.select(path);

    }

    concernOf(factory, name) {

        return this._root.app.concernOf(factory, name);

    }

    shutdown(reason) {

        this._app.tell(Signal.Stop, this._root);
        this._sys.tell(Signal.Stop, this._root);

        //@todo -> actually wait until app and sys finished shutting down
        //perhaps this is better done in the root/Guardian?
        //
        setTimeout(() => {

            this._root = null;
            this._app = null;
            this._sys = null;
            this._dl = null;
            this._events = null;

            console.log(reason);

        }, 1000);

    }

    on() {

        this._events.on.apply(this._events, arguments);

    }

    emit() {

        this._events.emit.apply(this._events, arguments);

    }

}

export default IsomorphicSystem;
