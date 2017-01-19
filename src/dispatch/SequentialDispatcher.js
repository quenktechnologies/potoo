import beof from 'beof';
import Promise from 'bluebird';
import Context from '../Context';
import Callable from '../Callable';
import Problem from './Problem';
import Message from './Message';
import UnhandledMessage from './UnhandledMessage';
import { or, insof, required, OK } from '../funcs';

class Frame extends Message {}
class Envelope extends Message {}
class Behaviour extends Message {}

const gt0 = (messages, frames) =>
    (messages.length > 0) && (frames.length > 0);

const exec = ({ messages, frames, self }) => {

    let message = messages.shift();
    let { receive, context, resolve, reject } = frames.shift();

    self.tell(new Behaviour({ become: busy(messages, frames, self) }));

   Promise.try(() => {

        let result = receive.call(context, message);

        if (result == null) {

            context.root().tell(new UnhandledMessage({
                message,
                to: context.path()
            }))

            frames.unshift(new Frame({ receive, context, resolve, reject }));

        } else {

            //The result is a promise/Thenable and we don't want
            //to wait until it finished to process the next frame.
            if (typeof result.then === 'function')
                self.tell(new Behaviour({ become: ready(messages, frames, self) }));

            resolve(result);

        }

    }).catch(error => {

        reject(error);
        context.parent().tell(new Problem(error, context, message));

    }).finally(() => {

        if (messages.length > 0)
            if (frames.length > 0)
                return exec({ messages, frames, self });

        return self.tell(new Behaviour({ become: ready(messages, frames, self) }))

    });

    return null;

};

const busy = (messages, frames, self) =>
    or(insof(Frame, f => frames.push(f)),
        insof(Envelope, env => messages.push(env.message)));

const ready = (messages, frames, self) =>
    or(
        insof(Frame, frame =>
            (frames.push(frame), (gt0(messages, frames)) ?
                exec({ messages, frames, self }) : OK)),

        insof(
            Envelope, env =>
            (messages.push(env.message), (gt0(messages, frames)) ?
                exec({ messages, frames, self }) : OK)))


/**
 * SequentialDispatcher executes receives in the order they are scheduled in the same
 * runtime as the event source.
 */
export class SequentialDispatcher {

    constructor(parent, context) {

        this._stack = [];
        this._order = [];
        this._messages = [];
        this._executor = ready([], [], this);

    }

    tell(message) {

        if (message instanceof Behaviour)
            return this._executor = message.become;

        this._executor(new Envelope({ message }));

    }

    ask({ receive, context, time = 0 }) {

        beof({ receive }).interface(Callable);
        beof({ context }).interface(Context);
        beof({ time }).optional().number();

        var p = new Promise((resolve, reject) =>
            this._executor(new Frame({ receive, context, resolve, reject })));

        return (time > 0) ? p.timeout(time) : p;

    }

}

export default SequentialDispatcher
