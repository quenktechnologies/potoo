import must from 'must';
import sinon from 'sinon';
import { Context, Reference } from 'potoo-lib';
import { ChildContext, LocalReference } from 'potoo-lib/ChildContext';

var context, root, parent, strategy, child, dispatch;
var throwit = e => { throw e; };
var start = () => {};

describe('ChildContext', function() {

    beforeEach(function() {

        root = sinon.createStubInstance(Reference);
        parent = sinon.createStubInstance(Context);
        parent.error = throwit;
        parent.select = () => { throw 'meta human'; };
        child = sinon.createStubInstance(Context);
        dispatch = sinon.createStubInstance(Reference);

        context = new ChildContext('/', parent, root, { strategy: throwit, dispatch, start });

    });

    describe('path', function() {

        it('must default to /main', function() {

            must(context.path()).be('/');

        });

    });

    describe('spawn', function() {

        it('must produce an actor reference', function() {

            must(context.spawn({ start })).be.instanceOf(LocalReference);

        });

    });

    describe('select', function() {

        it('must select existing References', function() {

            var one, two, three;

            one = context.spawn({

                id: 'one',
                start: function() {

                    two = this.spawn({
                        id: 'two',
                        start: function() {

                            three = this.spawn({ id: 'three', start })

                        }
                    })

                }
            });

            must(context.select('/one')).eql(one);
            must(context.select('/one/two')).eql(two);
            must(context.select('/one/two/three')).eql(three);

        });

    });

});
