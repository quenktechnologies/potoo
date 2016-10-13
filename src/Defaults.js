import beof from 'beof';
import Dispatcher from './dispatch/Dispatcher';
import SimpleMailbox from './dispatch/SimpleMailbox';
import SimpleDispatcher from './dispatch/SimpleDispatcher';
import OneForOneStrategy from './OneForOneStrategy';
import LocalReference from './LocalReference';
import Context from './Context';

/**
 * Defaults provides the defaults for creating a Concern.
 * You must pass a function to the constructor to actually create your Concern.
 * @implements {ConcernFactory}
 * @param {function} Constructor
 */
class Defaults {

    constructor(provider) {

        beof({ provider }).function();

        this._provider = provider;

    }

    dispatcher(context) {

        beof({ context }).interface(Context);

        return new SimpleDispatcher(this, context);

    }

    mailbox(dispatcher) {

        beof({ dispatcher }).interface(Dispatcher);

        return new SimpleMailbox(dispatcher);

    }

    errorHandlingStrategy() {

        return new OneForOneStrategy(function() {

        });

    }

    reference(context) {

        beof({ context }).interface(Context);

        return new LocalReference(context);

    }

    create(context) {

        beof({ context }).interface(Context);

        return this._provider(context);

    }

}

export default Defaults
