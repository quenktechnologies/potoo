import beof from 'beof';
import Promise from 'bluebird';
import SimpleMailbox from './SimpleMailbox';
import RunningState from '../state/RunningState';
import PausedState from '../state/PausedState';
import StoppedState from '../state/StoppedState';
import Context from '../Context';
import ConcernFactory from '../ConcernFactory';

//IE support
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {

        get: function() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        },
        set: function(value) {}
    });
}

const keyify = function(msg) {

    switch (typeof msg) {

        case 'function':
            return msg.name;

        case 'object':
            return msg.constructor.name;

        default:
            return '' + msg;

    }

}

/**
 * SimpleDispatcher handles the actual delivery of messages to
 * Concerns from their Mailbox.
 * @param {Concern} concern
 * @implements {EnqueueListener}
 */
class SimpleDispatcher {

    constructor(factory, context) {

        beof({ factory }).interface(ConcernFactory);
        beof({ context }).interface(Context);

        this._mailboxes = {};
        this._factory = factory;
        this._context = context;
        this._concern = factory.create(context);

    }

    _next(box) {

        var next;

        if (this._busy)
            return;

        this._busy = true;

        next = box.dequeue();

        if (next === null) {

            this._busy = false;
            return;

        }

        Promise.resolve(this._concern.onReceive(next.message, next.from)).
        then(actions => {

            var action = null;

            if (!actions)
                return null;

            else if (typeof actions === 'object')
                action = actions[keyify(msg)];

            else if (typeof actions === 'function')
                action = actions;

            if (typeof action === 'function')
                return Promise.resolve(action);

        }).
        catch(e => {
            this.executeChildError(e, next.from);
        }).
        then(() => this._busy = false).
        then(() => this._next(box));

    }

    onEnqueue(mailbox) {

        this._next(mailbox);

    }

    executeChildError(e, child) {

        beof({ e }).instance(Error);
        beof({ child }).interface(Reference);

        var strategy = this._factory.errorHandlingStrategy();
        var sig = strategy.decide(e);

        if (!(sig instanceof Signal))
            return this.parent().dispatcher().executeChildError(e, child);

        return Promise.resolve(() => strategy.apply(sig, child, this._context));


    }

    execute(action, success) {

        beof({ action }).function();
        beof({ success }).function();

        var concern = this._concern;

        Promise.try(function do_execute() {
            action(concern);
        }).
        then(success).
        catch(e => this.executeChildError(e, this._context.self()));

    }

    executeOnStart() {

        Promise.resolve(this._concern.onStart()).
        then(()=>this._context.self().setState(new RunningState(this._context))).
        catch(e => this._context.parent().dispatcher().executeChildError(e, this._concern));

    }

    executeOnPause(cb) {

        this._pause = true;
        Promise.resolve(this._concern.onPause()).
        then(()=>this._context.self().setState(new PausedState(this._context))).
        catch(e => this._context.parent().dispatcher().executeChildError(e, this._concern));

    }

    executeOnResume() {

        this._pause = false;
        Promise.resolve(this._concern.onResume()).
        then(() => this._context.self().setState(new RunningState(this._context))).
        catch(e => this._context.parent().dispatcher().executeChildError(e, this._concern));

    }

    executeOnRestart() {

        Promise.resolve(this._concern.onRestart()).
        then(() => this._concern = this._factory.create(this._context)).
        then(() => this._context.self().setState(new RunningState(this._context))).
        catch(e => this._context.parent().dispatcher().executeChildError(e, this._concern));

    }

    executeOnStop() {

        Promise.resolve(this._concern.onStop()).
        then(()=>this._context.self().setState(new StoppedState(this._context))).
        catch(e => this._context.parent().dispatcher().executeChildError(e, this._concern));

    }

}

export default SimpleDispatcher
