import must from 'must';
import PausedState from '../../src/state/PausedState'
import RestartingState from '../../src/state/RestartingState';
import ResumingState from '../../src/state/ResumingState';
import StoppingState from '../../src/state/StoppingState';
import Testing from '../../src/testing/Testing';

var state;
var ref;
var context;

describe('PausedState', function() {

    beforeEach(function() {

        context = new Testing.MockChildContext();

    });

    beforeEach(function() {

        ref = new Testing.MockReference();

    });

    beforeEach(function() {

        state = new PausedState(context);

    });

    describe('PausedState#pause', function() {

        it('should not morph', function() {

            must(state.pause()).be(state);

        });

    });

    describe('PausedState#resume', function() {

        it('should morph to ResumingState', function() {

            must(state.resume()).be.instanceOf(ResumingState);

        });

    });

    describe('PausedState#restart', function() {

        it('should morph to RestartingState', function() {

            must(state.restart()).be.instanceOf(RestartingState);

        });

    });

    describe('PausedState#stop', function() {

        it('should morph to StoppingState', function() {

            must(state.stop()).be.instanceOf(StoppingState);

        });


    });

    describe('PausedState#tell', function() {

        it('should queue messages', function() {

                        state.tell('something', state);
            must(context.Mailbox.queue.length).be(1);
            must(context.Mailbox.queue[0].message).be('something');
            must(context.Mailbox.queue[0].from).be(state);

        });

    });

});
