import must from 'must';
import sinon from 'sinon';
import Guardian from 'potoo-lib/Guardian';
import System from 'potoo-lib/System';
import { LocalReference } from 'potoo-lib/ChildContext';

var guardian, system;

describe('Guardian', function() {


    beforeEach(function() {

        system = sinon.createStubInstance(System);
        guardian = new Guardian(system);

    });

    describe('spawn', function() {

        it('should create a new actor reference', function() {

            must(guardian.spawn({ start: () => {} })).be.instanceOf(LocalReference);

        });

    });

    describe('select().tell()', function() {

        it('must drop messages', function() {

            guardian.select('/naps').tell('a message');
            must(system.publish.called).be(true);

        });

    });

});
