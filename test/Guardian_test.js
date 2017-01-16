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

    describe('select', function() {

        it('should return itself', function() {

            must(guardian.select('/naps')).be(guardian);

        });

    });

    describe('spawn', function() {

        it('should create a new actor reference', function() {

            must(guardian.spawn({ start: () => {} })).be.instanceOf(LocalReference);

        });

    });

    describe('tell', function() {

        it('must drop messages', function() {

            guardian.tell('a message');
            must(system.publish.called).be(true);

        });

    });

});
