import beof from 'beof';
import Promise from 'bluebird';
import Context from '../Context';
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

            return Promise.try(() => receive.call(context, message)).
            then(result => {

                if (result == null)
                    context.root().tell(new UnhandledMessage({
                        message,
                        to: context.path()
                    }));

                return result;

            }).
            then(result => resolve(result)).
            catch(error => {

                //Reject the waiting receive then pass the error to parent.
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

        if (messages.length > 0)
            if (stack.length > 0) {

                var { receive, context, resolve, reject } = stack.shift();
                var message = messages.shift();

                this._executor.tell(new Frame({ message, receive, context, resolve, reject }));
                return this.next(messages, stack, executor);

            }

    }

    tell(m) {

        this._messages.push(m);

        this.next(this._messages, this._stack, this._executor);

        /*
        while (this._stack.length > 0) {

            var message = this._messages.shift();

            if (message != null) {

                var { receive, context, resolve, reject } = this._stack.shift();
                this._executor.tell(new Frame({ message, receive, context, resolve, reject }));

            }

        }*/

    }


    ask({ receive, context, time = 0 }) {

        var p = new Promise((resolve, reject) => {
            this._stack.push({ receive, context, resolve, reject, promise: this });
        });

        this.next(this._messages, this._stack, this._executor);
        return (time > 0) ? p.timeout(time) : p;

    }

}

export default SequentialDispatcher
