import events from 'events';
import Promise from 'bluebird';
import beof from 'beof';
import Signal from './state/Signal';
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

        return new IsomorphicSystem();

    }

    deadLetters() {

        return this._root.deadLetters;

    }

    peer(instance, config) {

        this._root.peer(instance, config);

    }

    select(path) {

        return this._root.app.select(path);

    }

    concernOf(factory, name) {

        return this._root.app.concernOf(factory, name);

    }

    shutdown(reason) {

       // this._root.app.tell(Signal.Stop, this._root);

        //@todo -> actually wait until app and sys finished shutting down
        //perhaps this is better done in the root/Guardian?
        //
        setTimeout(() => {

            this._root = null;
            this._events = null;

            if (reason)
                throw reason;

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
