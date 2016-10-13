import beof from 'beof';
import Reference from './Reference';
import System from './System';
import Context from './Context';
import SimpleDispatcher from './dispatch/SimpleDispatcher';
import SimpleMailbox from './dispatch/SimpleMailbox';
import RunningState from './state/RunningState';
import ConcernFactory from './ConcernFactory';
import Address from './Address';

/**
 * ChildContext is the Context of each self created in this address space.
 * @implements {RefFactory}
 * @implements {Context}
 * @param {string} path
 * @param {Context} [parent]
 * @param {ConcernFactory} factory
 * @param {System} system
 */
class ChildContext {

    constructor(path, parent, factory, system) {

        beof({ path }).string();
        beof({ parent }).optional().interface(Context);
        beof({ factory }).interface(ConcernFactory);
        beof({ system }).interface(System);

        this._path = path;
        this._parent = parent;
        this._dispatcher = factory.dispatcher(this);
        this._mailbox = factory.mailbox(this._dispatcher);
        this._ref = factory.reference(this);
        this._system = system;
        this._children = [];

        this._dispatcher.executeOnStart();

    }

    path() {

        return this._path;

    }

    self() {

        return this._ref;

    }

    parent() {

        return this._parent;

    }

    isChild(ref) {

        var ret = false;

        this._children.forEach(child => {

            if (child.self() === ref)
                ret = true;

        });

        return ret;

    }

    children() {

        return this._children.slice();

    }

    mailbox() {

        return this._mailbox;

    }

    dispatcher() {

        return this._dispatcher;

    }

    system() {

        return this._system;

    }

    concernOf(factory, name) {

        beof({ factory }).interface(ConcernFactory);
        beof({ name }).string();

        var context = new ChildContext(`${this._path}/${name}`, this, factory, this._system);
        this._children.push(context);
        return context.self();

    }

    select(path) {

        beof({ path }).string();

        var address = Address.fromString(path);
        var childs = this.children();
        var parent = this.parent();

        var next = child => {

            var ref;

            if (!child) {

                return parent.select(address.toString());

            } else if (address.is(child.path())) {

                return child.self();

            } else if (address.isBelow(child.path())) {

                return child.select(path);

            }

            return next(childs.pop());
        }

        return next(childs.pop());

    }

}

export default ChildContext
