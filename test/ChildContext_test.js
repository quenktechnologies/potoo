import must from 'must';
import sinon from 'sinon';
import { Context, Reference } from 'potoo-lib';
import { Mailbox, Dispatcher } from 'potoo-lib/dispatch';
import { ChildContext, LocalReference } from 'potoo-lib/ChildContext';

var context, inbox, root, parent, strategy, child, dispatch;
var throwit = e => { throw e; };
var start = () => {};

describe('ChildContext', function() {

    beforeEach(function() {

        inbox = sinon.createStubInstance(Mailbox);
        root = sinon.createStubInstance(Reference);
        parent = sinon.createStubInstance(Context);
        parent.error = throwit;
        parent.select = () => { throw 'meta human'; };
        child = sinon.createStubInstance(Context);
        dispatch = sinon.createStubInstance(Dispatcher);

        context = new ChildContext('/', parent, root, { inbox, strategy: throwit, dispatch, start });

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

                start: function() {

                    two = this.spawn({
                        start: function() {

                            three = this.spawn({ start }, 'three')

                        }
                    }, 'two')

                }
            }, 'one');

            must(context.select('/one')).eql(one);
            must(context.select('/one/two')).eql(two);
            must(context.select('/one/two/three')).eql(three);

        });

    });

    xdescribe('ChildContext#isChild', function() {

        it('must work', function() {

            var one = context.concernOf(new Testing.ConcernFactory(), 'one');
            var two = context.concernOf(new Testing.ConcernFactory(), 'two');
            var three = context.concernOf(new Testing.ConcernFactory(), 'three');

            must(context.isChild(one)).be(true);
            must(context.isChild(two)).be(true);
            must(context.isChild(three)).be(true);

        });

        it('must not go crazy if child is this context', function() {

            must(context.isChild(context)).be(false);

        });


    });

});
