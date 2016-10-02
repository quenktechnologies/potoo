import must from 'must';
import Ticker from '../../src/state/Ticker';

var ticker;
var called;


describe('Ticker', function() {

    describe('Ticker#tick', function() {

        it('should do the action when the ticker reaches zero', function() {

            called = false;
            ticker = new Ticker(5, val => true, () => {}, () => called = true);

            ticker.tick(true);
            ticker.tick(true);
            ticker.tick(true);
            ticker.tick(true);
            ticker.tick(true);

            must(called).be(true);

        });

        it('should to the action if the intial counter is 0', function() {

            called = false;
            ticker = new Ticker(0, val => true, () => {}, () => called = true);
            must(called).be(true);

        });


    });

});
