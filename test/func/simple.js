import must from 'must';
import IsomorphicSystem from '../../src/IsomorphicSystem';
import Defaults from '../../src/Defaults';
import AppConcern from '../../src/AppConcern';

var system;
var buffer = [];
var one;
var two;
var three;
var sender;

class BufferClient extends AppConcern {

    onReceive(message, from) {

        buffer.push(message);

    }

}

before(function() {

    system = new IsomorphicSystem();

});

describe('The IsomorphicSystem', function() {

    it('should allow for a basic 3 node setup', function() {

        system.concernOf(new Defaults(context => new BufferClient(context)), 'one');
        system.concernOf(new Defaults(context => new BufferClient(context)), 'two');
        system.concernOf(new Defaults(context => new BufferClient(context)), 'three');

    });

    it('should be able to communicate with all three', function() {

        system.on('bounce', m => { throw new Error(m) });

        system.select('/app/one').tell('well');
        system.select('/app/two').tell('hello');
        system.select('/app/three').tell('pretty lady');

        must(buffer.join(' ')).be('well hello pretty lady');

    });


});
