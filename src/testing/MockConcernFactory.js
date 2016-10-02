import MockDispatcher from './MockDispatcher';
import MockMailbox from './MockMailbox';
import MockConcern from './MockConcern';
import MockReference from './MockReference';

class MockConcernFactory {

    constructor() {

        this.Dispatcher = new MockDispatcher();
        this.Mailbox = new MockMailbox();
        this.Concern = new MockConcern();

    }

    dispatcher() {

        return this.Dispatcher;

    }

    mailbox() {

        return this.Mailbox;

    }

    errorHandlingStrategy() {


    }

    reference() {

        return new MockReference();

    }

    create() {

        return this.Concern;

    }

}

export default MockConcernFactory
