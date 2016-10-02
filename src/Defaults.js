import beof from 'beof';
import SimpleMailbox from './dispatch/SimpleMailbox';
import SimpleDispatcher from './dispatch/SimpleDispatcher';
import OneForOneStrategy from './OneForOneStrategy';
import LocalReference from './LocalReference';

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

    dispatcher(factory, context) {

        return new SimpleDispatcher(factory, context);

    }

    mailbox(dispatcher) {

        return new SimpleMailbox(dispatcher);

    }

    errorHandlingStrategy() {

        return new OneForOneStrategy(function() {

        });

    }

    reference(context) {

        return new LocalReference(context);

    }

    create(context) {

        return this._provider(context);

    }

}

export default Defaults
