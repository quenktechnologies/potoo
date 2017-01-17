import beof from 'beof';
import Promise from 'bluebird';
import Context from '../Context';
import Callable from '../Callable';
import Problem from './Problem';
import Message from './Message';
import UnhandledMessage from './UnhandledMessage';

class Retry extends Message {}

class Executor {

    constructor(parent, dispatch) {

        this.receive = this.ready([], [], parent, dispatch);

    }

    busy(messages, frames, parent, dispatch) {

        return ({ message, next }) => {

            messages.push(message);
            frames.push(next);

        };

    }

    ready(messages, frames, parent, dispatch) {

        var exec = ({ message, next: { receive, context, resolve, reject } }) => {

            this.receive = this.busy(messages, frames, parent, dispatch);

            return Promise.try(() => {

                var result = receive.call(context, message);

                if (result == null) {

                    context.root().tell(new UnhandledMessage({
                        message,
                        to: context.path()
                    }))

                    frames.unshift({ receive, context, resolve, reject });
                    dispatch.tell(new Retry({ message: messages.pop() }));

                } else {

                    //The result is a promise/Thenable and we don't want
                    //to wait until it finished to process the next frame.
                    if (typeof result.then === 'function')
                        this.receive = this.ready(messages, frames, parent, dispatch);

                    resolve(result);

                }

            }).
            catch(error => {

                reject(error);
                parent.tell(new Problem({ context, error }));

            }).finally(() => {

                if (frames.length > 0)
                    return exec({ message: messages.shift(), next: frames.shift() });

                this.receive = this.ready(messages, frames, parent, dispatch);

            });

        }

        return exec;

    }

    tell(m) {

        return this.receive(m);

    }

}

/**
 * SequentialDispatcher executes receives in the order they are scheduled in the same
 * runtime as the event source.
 */
export class SequentialDispatcher {

    constructor(parent, context) {

        this._stack = [];
        this._order = [];
        this._messages = [];
        this._executor = new Executor(parent, this);

    }

    next(messages, stack, executor) {

        setTimeout(() => {
            if (messages.length > 0)
                if (stack.length > 0) {

                    var next = stack.shift();
                    var message = messages.shift();

                    this._executor.tell({ message, next });
                    return this.next(messages, stack, executor);

                }
        }, 0);

    }

    tell(m) {

        if (m instanceof Retry)
            this._messages.unshift(m);
        else
            this._messages.push(m);

        this.next(this._messages, this._stack, this._executor);

    }

    ask({ receive, context, time = 0 }) {

        beof({ receive }).interface(Callable);
        beof({ context }).interface(Context);
        beof({ time }).optional().number();

        var p = new Promise((resolve, reject) => {
            this._stack.push({ receive, context, resolve, reject })
        });

        this.next(this._messages, this._stack, this._executor);

        return (time > 0) ? p.timeout(time) : p;

    }

}

export default SequentialDispatcher
