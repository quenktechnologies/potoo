import 'source-map-support';
import must from 'must';
import Promise from 'bluebird';
import Signal from '../../src/state/Signal';
import RestartingState from '../../src/state/RestartingState';
import RunningState from '../../src/state/RunningState';
import Testing from '../../src/testing/Testing';

var state;
var ref;

describe('RestartingState', function() {

    beforeEach(function() {

        context = new Testing.MockChildContext();

    });

    beforeEach(function() {

        ref = new Testing.MockReference();

    });

    beforeEach(function() {

        state = new RestartingState(context);

    });

    describe('RestartingState#pause', function() {

        it('should not morph', function() {

            must(state.pause()).be(state);

        });

    });

    describe('RestartingState#resume', function() {

        it('should not morph', function() {

            must(state.resume()).be(state);

        });

    });

    describe('RestartingState#restart', function() {

        it('should not morph', function() {

            must(state.restart()).be(state);

        });

    });

    describe('RestartingState#stop', function() {

        it('should not morph', function() {

            must(state.stop()).be(state);

        });

    });

    describe('RestartingState#sync', function() {

        it('must attempt to restart all children', function() {

            context.Children = [
                new Testing.ChildContext(),
                new Testing.ChildContext(),
                new Testing.ChildContext()
            ];

            state.sync();

            context.Children.forEach(child => {
                must(child.Self.tells.length).be(1);
                must(child.Self.tells[0].message).be(Signal.Restart);
            });

        });

        it('should execute Concern#onRestart before restarting', function() {

            context.Children = [
                new Testing.ChildContext(),
                new Testing.ChildContext(),
                new Testing.ChildContext()
            ];

            state.sync();
            state.tell(Signal.Restarted, context.Children[0].Self);
            must(context.dispatcher().Concern.calls.onRestart).be(0);
            state.tell(Signal.Restarted, context.Children[1].Self);
            must(context.dispatcher().Concern.calls.onRestart).be(0);
            state.tell(Signal.Restarted, context.Children[2].Self);
            must(context.dispatcher().Concern.calls.onRestart).be(1);

        });

    });

    describe('ResumingState#tell', function() {

        it('should discard other messages', function() {

            state.sync();
            state.tell('something', state);
            must(context.system().deadLetterCount.length).be(1);

        });

    });

});
