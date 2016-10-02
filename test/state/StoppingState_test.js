import must from 'must';
import Signal from '../../src/state/Signal';
import StoppingState from '../../src/state/StoppingState';
import RunningState from '../../src/state/RunningState';
import Promise from 'bluebird';
import Testing from '../../src/testing/Testing';

var state;
var ref;
var context;

describe('StoppingState', function() {

    beforeEach(function() {

        context = new Testing.MockChildContext();

    });

    beforeEach(function() {

        ref = new Testing.MockReference();

    });

    beforeEach(function() {

        state = new StoppingState(context);

    });

    describe('StoppingState#pause', function() {

        it('should not morph', function() {

            must(state.pause()).be(state);

        });

    });

    describe('StoppingState#resume', function() {

        it('should not morph', function() {

            must(state.resume()).be(state);

        });

    });

    describe('StoppingState#restart', function() {

        it('should not morph', function() {

            must(state.restart()).be(state);

        });

    });

    describe('StoppingState#stop', function() {

        it('should not morph', function() {

            must(state.stop()).be(state);

        });

    });

    describe('StoppingState#sync', function() {

        it('must attempt to stop all children', function() {

            context.Children = [
                new Testing.MockChildContext(),
                new Testing.MockChildContext(),
                new Testing.MockChildContext()
            ];

            state.sync();

            context.Children.forEach(child => {
                must(child.Self.tells.length).be(1);
                must(child.Self.tells[0].message).be(Signal.Stop);
            });

        });

        it('should execute Concern#onStop after all children are stopped', function() {

            context.Children = [
                new Testing.MockChildContext(),
                new Testing.MockChildContext(),
                new Testing.MockChildContext()
            ];

            state.sync();
            state.tell(Signal.Stopped, context.Children[0].Self);
            must(context.dispatcher().calls.executeOnStop).be(0);
            state.tell(Signal.Stopped, context.Children[1].Self);
            must(context.dispatcher().calls.executeOnStop).be(0);
            state.tell(Signal.Stopped, context.Children[2].Self);
            must(context.dispatcher().calls.executeOnStop).be(1);

        });

    });

    describe('StoppingState#tell', function() {

        it('should discard other messages', function() {

            state.sync();
            state.tell('something', state);
            must(context.system().deadLetterCount.length).be(1);

        });

    });

});
