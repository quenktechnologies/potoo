import beof from 'beof';
import Promise from 'bluebird';
import Context from '../Context';
import Problem from './Problem';
import UnhandledMessage from './UnhandledMessage';

/**
 * SequentialDispatcher executes receives in the order they are scheduled in the same
 * runtime as the event source.
 */
export class SequentialDispatcher {

    constructor(parent) {

        this._stack = [];
        this._pending = 0;
        this._parent = parent;

    }

    schedule(receive, context, time = 0) {

        beof({ receive }).function();
        beof({ context }).interface(Context);
        beof({ time }).optional().number();

        var stack = this._stack;

        var p = (time > 0) ? new Promise((resolve, reject) =>
                stack.push({ receive, context, resolve, reject })).timeout(time) :
            new Promise((resolve, reject) =>
                stack.push({ receive, context, resolve, reject }));

        this.dispatch();

        return p;

    }

    dispatch() {

        ++this._pending;

        if (this._busy)
            return null; //already dispatching

        if (this._stack.length === 0)
            return null; //no receives yet

        this._busy = true;

        var { receive, context, resolve, reject } = this._stack.shift();
        var parent = this._parent;

        Promise.try(() => context.inbox().dequeue()).
        then(next => {

                if (next == null)
                    return this._stack.push({ receive, context, resolve, reject });

                return Promise.try(() => receive.call(context, next)).
                then(result => {

                        if (result == null)
                            context.root().tell(new UnhandledMessage({
                                    message: next,
                                    to: context.path()
                                }));

                                return result;

                            }).then(result => resolve(result))
                }).catch(error => {

                //Reject the waiting receive then pass the error to parent.
                reject(error);
                parent.tell(new Problem({ context, error }));

            }).finally(() => {

                --this._pending;
                this._busy = false;

                if (this._pending > 0)
                    return this.dispatch();

            });

        }

    }


    export default SequentialDispatcher
