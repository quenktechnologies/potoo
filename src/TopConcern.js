import beof from 'beof';
import System from './System';
import ConcernFactory from './ConcernFactory';
import ChildContext from './ChildContext';
import Reference from './Reference';

/**
 * TopConcern
 * @param {string} path
 * @param {type} name description
 * @param {System} system
 */
class TopConcern {

    constructor(path, system, parent) {

        beof({ path }).string();
        beof({ system }).interface(System);
        beof({ parent }).optional().interface(Reference);

        this._path = path;
        this._system = system;
        this._parent = parent;
        this._children = [];

    }

    path() {

        return this._path;

    }

    self() {

        return this;

    }

    parent() {

        return this._parent || this;

    }

    isChild(ref) {

        return (this._children.indexOf(ref) > -1);

    }

    children() {

        return this._children.slice();

    }

    mailbox() {

        return this;

    }

    dispatcher() {

        return this;

    }

    watch(ref) {

    }

    unwatch(ref) {


    }

    select(path) {

        return this._system.select(path);

    }

    tell(message, from) {

        if (this._parent)
            return this._parent.tell(message, from);

        throw new Error(`Message sent but no one cares: '${message}' sent to '${from}'`);

    }

    concernOf(factory, name) {

        beof({ factory }).interface(ConcernFactory);
        beof({ name }).string();

        var context = new ChildContext(`${this._path}/${name}`, this, factory, this._system);
        this._children.push(context);
        return context.self();

    }

    system() {

        return this._system;

    }

    enqueue(msg) {

        throw new TypeError('Cannot enqueue to \'/\'');

    }

    dequeue() {

        throw new TypeError('Cannot dequeue \'/\'');

    }

    executeChildError(e, child) {

        throw e;

    }

    executeOnReceive() {

    }

    executeOnStart() {

    }

    executeOnPause() {

    }

    executeOnResume() {

    }

    executeOnRestart() {

    }

    executeOnStop() {

    }

}

export default TopConcern
