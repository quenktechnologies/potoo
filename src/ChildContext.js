import beof from 'beof';
import Context from './Context';
import Reference from './Reference';
import Callable from './Callable';
import { v4 } from 'node-uuid';
import { SequentialDispatcher, Problem } from './dispatch';
import { escalate } from './dispatch/strategy';

const noop = () => {};
const default_dispatcher = (p) => new SequentialDispatcher(p);

/**
 * LocalReference is a Reference to an Actor in the current address space.
 * @implements {Reference}
 */
export class LocalReference {

    constructor(path, tellFn) {

        beof({ path }).string();
        beof({ tellFn }).function();

        this._tellFn = tellFn;
        this._path = path;

    }

    tell(m) {

        this._tellFn(m);

    }

    toJSON() {

        return this.toString();

    }

    toString() {

        return this.path;

    }

}

/**
 * ChildContext is the Context of each self created in this address space.
 * @implements {RefFactory}wzrd.in
 * @implements {Context}
 * @param {string} path
 * @param {Context} [parent]
 * @param {ConcernFactory} factory
 * @param {System} system
 */
export class ChildContext {

    constructor(path, parent, root, { strategy, dispatch }) {

        beof({ path }).string();
        beof({ parent }).interface(Context);
        beof({ root }).interface(Reference);
        beof({ strategy }).function();
        beof({ dispatch }).interface(Reference);

        this._stack = [];
        this._children = [];
        this._dispatch = dispatch;
        this._path = path;
        this._parent = parent;
        this._strategy = strategy;
        this._root = root;
        this._self = new LocalReference(this._path, m => {

            if (m instanceof Problem) {
                strategy(m.error, m.context, this);
            } else {
                dispatch.tell(m);
            }

        });

    }

    path() {

        return this._path;

    }

    parent() {

        return this._parent;

    }

    root() {

        return this._root;

    }

    self() {

        return this._self;

    }

    is(ref) {

        return (String(ref) === this._path);

    }

    select(path) {

        beof({ path }).string();

        if (path === this._path)
            return this.self();

        if (!path.startsWith(this._path))
            return this._parent.select(path);

        var childs = this._children.map(c => c.context);

        var next = child => {

            if (!child) {

                //@todo
                //should return a null reference
                return { tell() {} };

            } else if (child.path() === path) {

                return child.self();

            } else if (path.startsWith(child.path())) {

                return child.select(path);

            }

            return next(childs.pop());
        }

        return next(childs.pop());

    }

    spawn({
            strategy = escalate,
            dispatcher = default_dispatcher,
            start
        },
        name = v4()) {

        beof({ strategy }).function();
        beof({ dispatcher }).function();
        beof({ name }).string();
        beof({ start }).interface(Callable);

        var slash = (this._path === '/') ? '' : '/';
        var path = `${this._path}${slash}${name}`;
        var dispatch = dispatcher(this._self);
        var context = new ChildContext(path, this, this._root, { dispatch, strategy });
        var self = context.self();

        this._children.push({ path, context, start, strategy });
        start.call(context);
        self.tell('started');

        return self;

    }

    receive(next, time) {

        beof({ next }).function();
        beof({ time }).optional().number();

        return this._dispatch.ask({receive:next, context:this, time});

    }

}

export default ChildContext
