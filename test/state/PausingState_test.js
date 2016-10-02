import must from 'must';
import Promise from 'bluebird';
import PausingState from '../../src/state/PausingState';
import Signal from '../../src/state/Signal';
import PausedState from '../../src/state/PausedState';
import Testing from '../../src/testing/Testing';

var state;
var ref;
var childs = [];

describe('PausingState', function() {

    beforeEach(function() {

        context = new Testing.MockChildContext();

    });

    beforeEach(function() {

        ref = new Testing.MockReference();

    });

    beforeEach(function() {

        state = new PausingState(context);

    });

    describe('PausingState#pause', function() {

        it('should not morph', function() {

            must(state.pause()).be(state);

        });

    });

    describe('PausingState#resume', function() {

        it('should not morph', function() {

            must(state.resume()).be(state);

        });

    });

    describe('PausingState#restart', function() {

        it('should not morph', function() {

            must(state.restart()).be(state);

        });

    });

    describe('PausingState#stop', function() {

        it('should not morph', function() {

            must(state.stop()).be(state);

        });

    });

    describe('PausingState#sync', function() {

        it('must attempt to pause all children', function() {

            context.Children = [

                new Testing.ChildContext(),
                new Testing.ChildContext(),
                new Testing.ChildContext()
            ];

            state.sync();

            context.Children.forEach(child => {
                must(child.Self.tells.length).be(1);
                must(child.Self.tells[0].message).be(Signal.Pause);
            });

        });

        it('should execute Concern#onPause after all children are paused', function() {

            context.Children = [
                new Testing.ChildContext(),
                new Testing.ChildContext(),
                new Testing.ChildContext()
            ];

            state.sync();
            state.tell(Signal.Paused, context.Children[0].Self);
            must(context.dispatcher().calls.executeOnPause).be(0);
            state.tell(Signal.Paused, context.Children[1].Self);
            must(context.dispatcher().calls.executeOnPause).be(0);
            state.tell(Signal.Paused, context.Children[2].Self);
            must(context.dispatcher().calls.executeOnPause).be(1);

        });

    });

    describe('PausingState#tell', function() {

        it('should discard other messages', function() {

            state.sync();
            state.tell('something', state);
            must(context.system().deadLetterCount.length).be(1);

        });

    });

});
