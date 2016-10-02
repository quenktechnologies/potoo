import must from 'must';
import RunningState from '../../src/state/RunningState';
import PausingState from '../../src/state/PausingState';
import RestartingState from '../../src/state/RestartingState';
import StoppingState from '../../src/state/StoppingState';
import MockChildContext from '../../src/testing/MockChildContext';
import MockReference from '../../src/testing/MockReference';

var state;
var ref;

describe('RunningState', function() {

    beforeEach(function() {

        context = new MockChildContext();

    });

    beforeEach(function() {

        ref = new MockReference();

    });

    beforeEach(function() {

        state = new RunningState(context);

    });

    describe('RunningState#pause', function() {

        it('should morph to PausingState', function() {

            must(state.pause()).be.instanceOf(PausingState);

        });

    });

    describe('RunningState#resume', function() {

        it('should not morph', function() {

            must(state.resume()).be(state);

        });

    });

    describe('RunningState#restart', function() {

        it('should morph to RestartingState', function() {

            must(state.restart()).be.instanceOf(RestartingState);

        });

    });

    describe('RunningState#stop', function() {

        it('should morph to StoppingState', function() {

            must(state.stop()).be.instanceOf(StoppingState);

        });


    });

    describe('RunningState#tell', function() {

        it('should deliver messages', function() {

            state.tell('something', state);
            must(context.Mailbox.queue.length).be(1);
            must(context.Mailbox.queue[0].message).be('something');
            must(context.Mailbox.queue[0].from).be(state);

        });

    });

});
