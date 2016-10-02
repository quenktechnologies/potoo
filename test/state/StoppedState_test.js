import must from 'must';
import StoppedState from '../../src/state/StoppedState'
import RestartingState from '../../src/state/RestartingState';
import ResumingState from '../../src/state/ResumingState';
import StoppingState from '../../src/state/StoppingState';
import Testing from '../../src/testing/Testing';

var state;
var ref;
var context;

describe('StoppedState', function() {

    beforeEach(function() {

        context = new Testing.MockChildContext();

    });

    beforeEach(function() {

        ref = new Testing.MockReference();

    });

    beforeEach(function() {

        state = new StoppedState(context);

    });

    describe('StoppedState#pause', function() {

        it('should not morph', function() {

            must(state.pause()).be(state);

        });

    });

    describe('StoppedState#resume', function() {

        it('should not morph', function() {

            must(state.resume()).be(state);

        });

    });

    describe('StoppedState#restart', function() {

        it('should morph to RestartingState', function() {

            must(state.restart()).be.instanceOf(RestartingState);

        });

    });

    describe('StoppedState#stop', function() {

        it('should not morph', function() {

            must(state.stop()).be(state);

        });

    });

    describe('StoppedState#tell', function() {

        it('should discard messages', function() {

            state.sync();
            state.tell('something', state);
            must(context.system().deadLetterCount.length).be(1);

        });

    });

});
