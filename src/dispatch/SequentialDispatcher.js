import beof from 'beof';
import Promise from 'bluebird';
import Context from '../Context';
import Callable from '../Callable';
import Problem from './Problem';
import Frame from './Frame';
import UnhandledMessage from './UnhandledMessage';

class Executor {

    constructor(parent) {

        this.receive = this.ready([], parent);

    }

    busy(frames, parent) {

        return m => frames.push(m);

    }

    ready(frames, parent) {

        var exec = ({ message, receive, context, resolve, reject }) => {

            this.receive = this.busy(frames, parent);

            return Promise.try(() => {

                    var result = receive.call(context, message);

                    if (result == null) {

                        context.root().tell(new UnhandledMessage({
                            message,
                            to: context.path()
                        }));

                    } else if (typeof result.then === 'function') {

                        //The result is a promise/Thenable and we don't want
                        //to wait until it finished to process the next frame.
                        this.receive = this.ready(frames, parent);

                    }


                return result;

            }).
        then(result => resolve(result)).
        catch(error => {

            reject(error);
            parent.tell(new Problem({ context, error }));

        }).finally(() => {

            if (frames.length > 0)
                return exec(frames.shift());

            this.receive = this.ready(frames, parent);

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
        this._executor = new Executor(parent);

    }

    next(messages, stack, executor) {

        setTimeout(() => {
            if (messages.length > 0)
                if (stack.length > 0) {

                    var { receive, context, resolve, reject } = stack.shift();
                    var message = messages.shift();

                    this._executor.tell(new Frame({ message, receive, context, resolve, reject }));
                    return this.next(messages, stack, executor);

                }
        }, 0);

    }

    tell(m) {

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
