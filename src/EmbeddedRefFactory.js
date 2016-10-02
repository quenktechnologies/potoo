import beof from 'beof';
import Reference from './Reference';
import NullReference from './NullReference';
import System from './System';
import Context from './Context';
import RunningState from './state/RunningState';
import ConcernFactory from './ConcernFactory';
import Address from './Address';

/**
 * EmbeddedRefFactory
 * @implements {RefFactory}
 */
class EmbeddedRefFactory {

    constructor(path, parent, children, system, Constructor) {

        beof({ path }).string();
        beof({ parent }).optional().interface(Context);
        beof({ children }).instance(Array);
        beof({ system }).interface(System);
        beof({Constructor}).function();

        this._path = path;
        this._parent = parent;
        this._children = children;
        this._system = system;
        this._Constructor = Constructor;

    }

    concernOf(factory, name) {

        beof({ factory }).interface(ConcernFactory);
        beof({ name }).string();

        var context = new this._Constructor(`${this._path}/${name}`, this, factory, this._system);
        this._children.push(context);
        return context.self();

    }

    select(path) {

        beof({ path }).string();

        var address = Address.fromString(path);
        var childs = this._children;
        var parent = this._parent;

        var next = child => {

            var ref;

            if (!child) {

                if (parent)
                    return parent.select(address);

                return new NullReference(path, this._system);

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

export default EmbeddedRefFactory
