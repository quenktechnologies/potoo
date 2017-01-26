import beof from 'beof';
import Promise from 'bluebird';
import Context from '../Context';
import Callable from '../Callable';
import Problem from './Problem';
import Message from './Message';
import Envelope from './Envelope';
import { or, insof, required, OK } from '../funcs';
import { ReceiveEvent, MessageEvent, MessageUnhandledEvent, MessageHandledEvent } from './events';
import Reference from '../Reference';

class Frame extends Message {}
class Behaviour extends Message {}

const gt0 = (messages, frames) =>
    (messages.length > 0) && (frames.length > 0);

const exec = ({ messages, frames, self, root }) => {

    let { message } = messages.shift();
    let { receive, context, resolve, reject, name } = frames.shift();

    self.tell(new Behaviour({ become: busy(messages, frames, self, root) }));

    Promise.try(() => {

        let result = receive.call(context, message);

        if (result == null) {

            frames.unshift(new Frame({ receive, context, resolve, reject }));

            root.tell(new MessageUnhandledEvent({ message, path: context.path(), name }));

        } else {

            //The result is a Promise/Thenable and we don't want
            //to wait until it finished to process the next frame.
            if (typeof result.then === 'function')
                self.tell(new Behaviour({ become: ready(messages, frames, self, root) }));

            resolve(result);

            root.tell(new MessageHandledEvent({ path: context.path(), message, name }));

        }

    }).catch(error => {

        reject(error);
        context.parent().tell(new Problem(error, context, message));

    }).finally(() => {

        if (messages.length > 0)
            if (frames.length > 0)
                return exec({ messages, frames, self, root });

        return self.tell(new Behaviour({ become: ready(messages, frames, self, root) }))

    });

    return null;

};

const busy = (messages, frames, self, root) =>
    or(insof(Frame, frame =>
            (frames.push(frame),
                root.tell(new ReceiveEvent({ name:frame.name, path: frame.context.path(), })))),
        insof(Envelope, env => (messages.push(env), root.tell(new MessageEvent(env)))));

const ready = (messages, frames, self, root) =>
    or(
        insof(Frame, frame =>
            (frames.push(frame), (gt0(messages, frames)) ?
                exec({ messages, frames, self, root }) : OK,
                root.tell(new ReceiveEvent({ path: frame.context.path() })))),

        insof(Envelope, env =>
            (messages.push(env), (gt0(messages, frames)) ?
                exec({ messages, frames, self, root }) : OK, root.tell(new MessageEvent(env)))))


/**
 * SequentialDispatcher executes receives in the order they are scheduled in the same
 * runtime as the event source.
 */
export class SequentialDispatcher {

    constructor(root) {

        beof({ root }).interface(Reference);

        this._stack = [];
        this._order = [];
        this._messages = [];
        this._executor = ready([], [], this, root);

    }

    tell(message) {

        if (message instanceof Behaviour)
            return this._executor = message.become;

        this._executor(message);

    }

    ask({ receive, context, time = 0, name = '' }) {

        beof({ receive }).interface(Callable);
        beof({ context }).interface(Context);
        beof({ time }).optional().number();

        var p = new Promise((resolve, reject) =>
            this._executor(new Frame({ receive, context, resolve, reject, name })));

        return (time > 0) ? p.timeout(time) : p;

    }

}

export default SequentialDispatcher
