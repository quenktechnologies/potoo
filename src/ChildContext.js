import beof from 'beof';
import Promise from 'bluebird';
import Context from './Context';
import Reference from './Reference';
import Callable from './Callable';
import { v4 } from 'uuid';
import { SequentialDispatcher, Problem, Envelope } from './dispatch';
import { SelectMissEvent, SelectHitEvent } from './dispatch/events';
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
 * @implements {RefFactory}
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
        this._self = new LocalReference(path, message => {

            if (message instanceof Error) {

                if (message instanceof Problem)
                    strategy(message.error, message.context, this);
                else
                    throw message; //should never happen
                //this.parent().tell(message);

            } else {

                dispatch.tell(new Envelope({ path, message }));

            }

        });

    }

    path() {

        return this._path;

    }

    parent() {

        return this._parent.self();

    }

    root() {

        return this._root;

    }

    none() {

        return this._root.self();

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
            return (
                this._root.tell(new SelectHitEvent({ requested: path, from: this._path })),
                this.self()
            );

        if (!path.startsWith(this._path))
            return (
                this._root.tell(new SelectMissEvent({ requested: path, from: this._path })),
                this._parent.select(path)
            );

        var childs = this._children.map(c => c.context);

        var next = child => {

            if (!child) {

                return this._root;

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
        id = v4(),
        strategy = escalate,
        dispatcher = default_dispatcher,
        start
    }) {

        beof({ strategy }).function();
        beof({ dispatcher }).function();
        beof({ id }).string();
        beof({ start }).interface(Callable);

        var slash = (this._path === '/') ? '' : '/';
        var path = `${this._path}${slash}${id}`;
        var dispatch = dispatcher(this._root);
        var context = new ChildContext(path, this, this._root, { dispatch, strategy });
        var self = context.self();

        this._children.push({ path, context, start, strategy });

        Promise.try(() => start.call(context, context)).
        then(() => self.tell('started')).
        catch(error =>
            this._strategy(new Problem(error, context), context, this));

        return self;

    }

    receive(next, time) {

        beof({ next }).function();
        beof({ time }).optional().number();

        return this._dispatch.ask({ receive: next, context: this, time });

    }

}

export default ChildContext
