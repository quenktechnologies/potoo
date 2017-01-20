import must from 'must';
import IsomorphicSystem from 'potoo-lib/IsomorphicSystem';

var system;

describe('The IsomorphicSystem', function() {

    beforeEach(function() {

        system = new IsomorphicSystem();

    });

    it('should allow for a basic 3 node setup', function(done) {

        var buffer = [];

        var start = c =>
            c.receive(m => (m === 'started') ? null : buffer.push(m));

        system.spawn({ id: 'one', start });
        system.spawn({ id: 'two', start });
        system.spawn({ id: 'three', start });

        system.select('/one').tell('well');
        system.select('/two').tell('hello');
        system.select('/three').tell('pretty lady');

        setTimeout(() => {
            must(buffer.join(' ')).be('well hello pretty lady');
            done();
        }, 1000);
    });

});
