import must from 'must';
import LocalReference from '../src/LocalReference';
import Signal from '../src/state/Signal';
import RunningState from '../src/state/RunningState';
import PausingState from '../src/state/PausingState';
import RestartingState from '../src/state/RestartingState';
import StoppingState from '../src/state/StoppingState';
import Testing from '../src/testing/Testing';

var ref;
var context;

const DeadLetters = {
    told: [],
    tell(message, from) {
        this.told.push(told);
    }

}

describe('LocalReference', function() {

    beforeEach(function() {

        context = new Testing.ChildContext();
        context.System.DeadLetters = DeadLetters;
        ref = new LocalReference(context);

    });

    describe('LocalReference#pause', function() {

        it('should pause', function() {

            ref.tell(Signal.Pause);
            must(context.Dispatcher.calls.execute).be(1);

        });

    });

    describe('LocalReference#resume', function() {

        it('should resume the Concern', function() {

            ref.tell(Signal.Pause);
            must(context.Dispatcher.calls.execute).be(0);
            ref.tell(Signal.Resume);
            must(context.Dispatcher.calls.execute).be(1);

        });


        it('should resume only if paused', function() {

            ref.tell(Signal.Resume);
            must(context.Dispatcher.calls.executee).be(0);
            ref.tell(Signal.Restart);
            must(context.Dispatcher.calls.execute).be(0);
            ref.tell(Signal.Stop);
            must(context.Dispatcher.calls.execute).be(0);

        });

    });

    describe('LocalReference#restart', function() {

        xit('should morph to RestartingState', function() {

            must(state.restart()).be.instanceOf(RestartingState);

        });

    });

    describe('LocalReference#stop', function() {

        xit('should morph to StoppingState', function() {

            must(state.stop()).be.instanceOf(StoppingState);

        });


    });

});
