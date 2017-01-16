import beof from 'beof';
import Promise from 'bluebird';
import Guardian from './Guardian';

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the guardian of a tree your application will
 * branch into.
 * @implements {System}
 */
class IsomorphicSystem {

    constructor() {

        this._subs = [];
        this._guardian = new Guardian(this);

    }

    /**
     * create a new IsomorphicSystem
     * @returns {IsomorphicSystem}
     */
    static create() {

        return new IsomorphicSystem();

    }

    select(path) {

        return this._guardian.select(path);

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

        this._subs.forEach(s => s.call(this, event));

    }

}

export default IsomorphicSystem
