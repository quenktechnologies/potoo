import must from 'must';
import ChildContext from '../src/ChildContext';
import LocalReference from '../src/LocalReference';
import NullReference from '../src/NullReference';
import Testing from '../src/testing/Testing';

var context;

describe('ChildContext', function() {

    beforeEach(function() {

        context = new ChildContext(
            '/app/main',
            new Testing.ChildContext(),
            new Testing.ConcernFactory(),
            new Testing.System());

    });

    describe('ChildContext#path', function() {

        it('must default to /main', function() {

            must(context.path()).be('/app/main');

        });

    });

    describe('ChildContext#concernOf', function() {

        it('must provide a LocalReference', function() {

            must(context.concernOf(new Testing.ConcernFactory(), 'users')).instanceOf(Testing.MockReference);

        });

    });

    describe('ChildContext#select', function() {

        it('must select existing References', function() {

            var one = context.concernOf(new Testing.ConcernFactory(), 'one');
            var two = context.concernOf(new Testing.ConcernFactory(), 'two');
            var three = context.concernOf(new Testing.ConcernFactory(), 'three');

            must(context.select('/app/main/one')).be(one);
            must(context.select('/app/main/two')).be(two);
            must(context.select('/app/main/three')).be(three);

        });

        it('should return a NullReference if it could not be resolved', function() {

            context = new ChildContext(
                '/app/main',
                null,
                new Testing.ConcernFactory(),
                new Testing.System());

            must(context.select('ssh://user@remote/path/to/concern')).
            be.instanceOf(NullReference);

        });

    });

});
