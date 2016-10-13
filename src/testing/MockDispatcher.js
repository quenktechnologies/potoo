import Promise from 'bluebird';
import MockConcern from './MockConcern';

/**
 * MockDispatcher
 */
class MockDispatcher {

    constructor() {

        this.calls = {
            execute: 0,
            executeOnStart: 0,
            executeOnRestart: 0,
            executeOnStop: 0,
            executeOnPause: 0,
            executeOnResume: 0
        };

        this.Concern = new MockConcern();

    }

    onEnqueue(mailbox) {


    }

    execute(cb, success) {

        return Promise.try(()=>cb(this.Concern)).
        then(success);

    }

    executeChildError(e, child) {



    }

    executeRegeneration() {

    }

    executeOnStart() {

        this.calls.executeOnStart = this.calls.executeOnStart + 1;

    }

    executeOnPause() {

        this.calls.executeOnPause = this.calls.executeOnPause + 1;

    }

    executeOnResume() {

        this.calls.executeOnResume = this.calls.executeOnResume + 1;

    }

    executeOnRestart() {

        this.calls.executeOnRestart = this.calls.executeOnRestart + 1;

    }

    executeOnStop() {

        this.calls.executeOnStop = this.calls.executeOnStop + 1;

    }

}

export default MockDispatcher
