import must from 'must';
import Signal from '../../src/state/Signal';
import ResumingState from '../../src/state/ResumingState';
import RunningState from '../../src/state/RunningState';
import Promise from 'bluebird';
import Testing from '../../src/testing/Testing';

var state;
var ref;
var childs = [];

describe('ResumingState', function() {

    beforeEach(function() {

        context = new Testing.MockChildContext();

    });

    beforeEach(function() {

        ref = new Testing.MockReference();

    });

    beforeEach(function() {

        state = new ResumingState(context);

    });

    describe('ResumingState#pause', function() {

        it('should not morph', function() {

            must(state.pause()).be(state);

        });

    });

    describe('ResumingState#resume', function() {

        it('should not morph', function() {

            must(state.resume()).be(state);

        });

    });

    describe('ResumingState#restart', function() {

        it('should not morph', function() {

            must(state.restart()).be(state);

        });

    });

    describe('ResumingState#stop', function() {

        it('should not morph', function() {

            must(state.stop()).be(state);

        });

    });

    describe('ResumingState#sync', function() {

        it('must attempt to resume all children', function() {

            context.Children = [
                new Testing.ChildContext(),
                new Testing.ChildContext(),
                new Testing.ChildContext()
            ];

            state.sync();

            context.Children.forEach(child => {
                must(child.Self.tells.length).be(1);
                must(child.Self.tells[0].message).be(Signal.Resume);
            });

        });

        it('should execute Concern#onResume after all children resumed', function() {

            context.Children = [
                new Testing.ChildContext(),
                new Testing.ChildContext(),
                new Testing.ChildContext()
            ];

            state.sync();
            state.tell(Signal.Resumed, context.Children[0].Self);
            must(context.dispatcher().calls.executeOnResume).be(0);
            state.tell(Signal.Resumed, context.Children[1].Self);
            must(context.dispatcher().calls.executeOnResume).be(0);
            state.tell(Signal.Resumed, context.Children[2].Self);
            must(context.dispatcher().calls.executeOnResume).be(1);

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
