import must from 'must';
import IsomorphicSystem from 'potoo-lib/IsomorphicSystem';

var system;

describe('The IsomorphicSystem', function() {

    beforeEach(function() {

        system = new IsomorphicSystem();

    });

    it('should allow for a basic 3 node setup', function(done) {

        var buffer = [];

        var start = function() {
            this.receive(m => console.log(m));
            this.receive(m => {
                buffer.push(m)
            });
        };

        system.spawn({ start }, 'one');
        system.spawn({ start }, 'two');
        system.spawn({ start }, 'three');

        system.select('/one').tell('well');
        system.select('/two').tell('hello');
        system.select('/three').tell('pretty lady');

        setTimeout(() => {
            must(buffer.join(' ')).be('well hello pretty lady');
            done();
        }, 1000);
    });

});
