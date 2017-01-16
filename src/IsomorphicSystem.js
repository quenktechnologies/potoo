import beof from 'beof';
import Promise from 'bluebird';
import Guardian from './Guardian';
import { DroppedMessage, UnhandledMessage } from './dispatch';
import { or, insof, ok } from './funcs';

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the guardian of a tree your application will
 * branch into.
 * @implements {System}
 */
class IsomorphicSystem {

    constructor(options = { log: { level: 4 } }) {

        var { log } = options;

        this._subs = [
            or(insof(DroppedMessage, ok((log.level <= 4), m =>
                    console.warn(`DroppedMessage: to ${m.to} message: ${m.message}.`))),

                insof(UnhandledMessage, ok((log.level <= 4), m =>
                    console.warn(`UnhandledMessage: to ${m.to} message: ${m.message}.`))))

        ];
        this._guardian = new Guardian(this);

    }

    /**
     * create a new IsomorphicSystem
     * @param {object} options
     * @returns {IsomorphicSystem}
     */
    static create() {

        return new IsomorphicSystem();

    }

    select(path) {

        return this._guardian.tree.select(path);

    }

    spawn(spec, name) {

        return this._guardian.spawn(spec, name);

    }

    subscribe(f) {

        this._subs.push(f);
        return this;

    }

    unsubscribe(f) {

        var i = this._subs.indexOf(f);

        if (i > 0)
            this._subs.splice(i, 1);

        return this;

    }

    publish(evt) {

        this._subs.forEach(s => s.call(this, evt));

    }

}

export default IsomorphicSystem
