import MockSystem from './MockSystem';
import MockDispatcher from './MockDispatcher';
import MockMailbox from './MockMailbox';
import MockReference from './MockReference';
/**
 * MockChildContext
 */
class MockChildContext {

    constructor() {

        this.Children = [];
        this.System = new MockSystem();
        this.Dispatcher = new MockDispatcher();
        this.Self = new MockReference();
        this.Parent = null;
        this.Mailbox = new MockMailbox();
        this.Selection = new MockReference();

    }

    isChild(ref) {

        var ret = false;

        this.Children.forEach(child => {

            if (ref === child.self())
                ret = true;

        });

        return ret;

    }

    children() {

        return this.Children.slice();

    }

    path() {

        return this.Self.path();

    }

    self() {

        return this.Self;

    }

    parent() {

        return this.Parent ? this.Parent : new MockChildContext();

    }

    mailbox() {

        return this.Mailbox;

    }

    dispatcher() {

        return this.Dispatcher;

    }

    system() {

        return this.System;

    }

    concernOf(name, factory) {

        var ref = new MockReference();
        this.mock.refs.push(ref);
        return ref;

    }

    select(path) {

        return this.Selection;

    }

}

export default MockChildContext
